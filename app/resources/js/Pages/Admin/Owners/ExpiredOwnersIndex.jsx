import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import Button from '@mui/lab/LoadingButton';


import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { css } from '@emotion/react'
import { defaultTheme } from '@/Components/DefaultThemeProvider';

import dayjs from "dayjs";
// プラグインが必要
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// tzを有効にする記述
dayjs.extend(utc);
dayjs.extend(timezone);

// ブラウザのtimezoneを予測で取得する（つまり'Asia/Tokyo'などを取得する）。
const defaultTimezone = dayjs.tz.guess()


/** @jsxImportSource @emotion/react */
export default function Index( {auth, owners} ) {
    const [processingId, setProcessingId] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [pushedButtonType, setPushedButtonType] = useState('')
    const [nowPage, setNowPage] = useState(owners.current_page)
    const useStates = {
        processingId, setProcessingId,
        disabled, setDisabled,
        pushedButtonType, setPushedButtonType,
        nowPage, setNowPage,
    }

    const PaginationChange = (e, page) => {
        setNowPage(page)
        router.get( route('admin.expired-owners.index'), {page:page} )
    }
    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Admin") +'/'+ __('Expired Owners') }</h2>}
        >
            <Head title={ __("Admin") +'/'+ __('Expired Owners') } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-0 md:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="py-6 text-gray-900 dark:text-gray-100 max-w-[700px] mx-auto">

                            <BasicTable
                                owners={owners}
                                useStates={useStates}
                                className="mt-[16px]"
                            />

                            <Stack spacing={2} direction="row" justifyContent="flex-end" className="mt-[16px]">
                                <Pagination count={owners.last_page} defaultPage={owners.current_page} siblingCount={2} boundaryCount={2}
                                    disabled={disabled}
                                    onChange={PaginationChange}
                                />
                            </Stack>

                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}





function BasicTable({owners, useStates, className}) {
    const {
        processingId, setProcessingId,
        disabled, setDisabled,
        pushedButtonType, setPushedButtonType,
        nowPage, setNowPage,
    } = useStates
    const _token = usePage().props._token

    // デフォルトtimezoneを翻訳して取得する。
    const langTimezone = __(defaultTimezone)

    const palette = defaultTheme().palette
    const bp = defaultTheme().breakpoints

    const tableRowCss = css`
        transition: background 0.15s;
        :hover{ background:${palette.bg2}; }
    `

    const restoreSubmit = (e, owner_id) => {
        const alertText = __("It will be “owner managed”. \r\nDo you want to run it?")
        if ( !confirm(alertText) ) return

        setProcessingId(owner_id)
        setDisabled(true)
        setPushedButtonType('restore')
        return router.visit( route('admin.expired-owners.restore', owner_id), {
          method: 'put',
          data: {
            _token,
            page: nowPage,
          },
          onfinish: visit => {
            setProcessingId(false)
            setDisabled(false)
            setPushedButtonType('')
          }
        })
    }

    const deleteSubmit = (e, owner_id) => {
        const alertText = __("Once deleted, it cannot be restored. \r\nAre you sure you want to delete it?")
        if ( !confirm(alertText) ) return

        setProcessingId(owner_id)
        setDisabled(true)
        setPushedButtonType('delete')
        router.visit( route('admin.expired-owners.destroy', owner_id), {
            method: 'delete',
            data: {
                _token: _token,
                page: nowPage
            },
            onFinish: visit => {
                setProcessingId(false)
                setDisabled(false)
                setPushedButtonType('')
            },
        })
    }

  return (<>

    {/* tablet幅未満で表示されるテーブル */}
    <TableContainer component={Paper} className={className}
      css={css`
        ${bp.up('tablet')} { display:none; }
        th, td { padding-left:0; padding-right:0; }
      `}
    >
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">ID</TableCell>
            <TableCell align="center">
            <div>{ __('Name') }</div>
            <div>{ __('Email') }</div>
            <div>{
                `${__('Deleted at')} (${
                    __(':timezone time zone', {timezone:langTimezone})
                })`
            }</div>
            </TableCell>
            <TableCell align="center"></TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {owners.data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              css={tableRowCss}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="center">
              <div>{row.name}</div>
              <div>{row.email}</div>
              <div>{dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')}</div>
              </TableCell>

              <TableCell align="center">
                <Button variant="contained" color="secondary"
                    disabled={disabled}
                    loading={ row.id === processingId && pushedButtonType === 'restore' }
                    onClick={ e => restoreSubmit(e, row.id) }
                >{ __('Restore') }</Button>
                <br />
                <Button variant="contained" color="error"
                    css={css`margin-top: 16px;`}
                    disabled={disabled}
                    loading={ row.id === processingId && pushedButtonType === 'delete' }
                    onClick={ e => deleteSubmit(e, row.id) }
                >{ __('Delete Completely') }</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>


    {/* tablet幅以上で表示されるテーブル */}
    <TableContainer component={Paper} className={className}
      css={css`
        ${bp.down('tablet')} { display:none; }
      `}
    >
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">ID</TableCell>
            <TableCell align="center">{ __('Name') }</TableCell>
            <TableCell align="center">{ __('Email') }</TableCell>
            <TableCell align="center">{
                `${__('Deleted at')} (${
                    __(':timezone time zone', {timezone:langTimezone})
                })`
            }</TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {owners.data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              css={tableRowCss}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">{dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')}</TableCell>

              <TableCell align="right">
                <Button variant="contained" color="secondary"
                    disabled={disabled}
                    loading={ row.id === processingId && pushedButtonType === 'restore' }
                    onClick={ e => restoreSubmit(e, row.id) }
                >{ __('Restore') }</Button>
              </TableCell>

              <TableCell align="right">
                <Button variant="contained" color="error"
                    disabled={disabled}
                    loading={ row.id === processingId && pushedButtonType === 'delete' }
                    onClick={ e => deleteSubmit(e, row.id) }
                >{ __('Delete Completely') }</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  </>);
}
