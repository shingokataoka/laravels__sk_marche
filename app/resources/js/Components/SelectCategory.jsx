import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { usePage } from '@inertiajs/react';
import { defaultTheme } from './DefaultThemeProvider';
import { css } from '@emotion/react';



/** @jsxImportSource @emotion/react */
export default function SelectCategory({
    className,
    primaryCategories,
    secondary_category_id, setSecondaryCategoryId,
}) {
    const palette = defaultTheme().palette
    const errorText = usePage().props.errors.secondary_category_id


  return (<div className={className}>
    <FormControl sx={{ m: 0, minWidth: 120, width:'100%' }}
        css={css`
            ${ !errorText || `
                label { color: ${palette.error.main} !important; }
                * { border-color: ${palette.error.main} !important; }
            ` }
        `}
    >
    <InputLabel htmlFor="grouped-select">{ __('Category') }</InputLabel>
    <Select
        value={secondary_category_id}
        onChange={ e => setSecondaryCategoryId(e.target.value)}
        id="grouped-select"
        label={ __('Category') }
    >
        <MenuItem value="">
        <em>{ __('Unselected') }</em>
        </MenuItem>
        {primaryCategories.map( (primaryCategory, index) => [
        <ListSubheader>{ primaryCategory.name }</ListSubheader>,
        ...primaryCategory.secondary_categories.map( (secondaryCategory,index2) => (
            <MenuItem
                key={index2}
                value={secondaryCategory.id}
            >
                { secondaryCategory.name }
            </MenuItem>
        ) )
        ] )}
    </Select>
    </FormControl>
    <div css={css`
        padding-top: 1px;
        padding-left: 16px;
        color: ${palette.error.main};
        font-size: 0.85rem;
    `}>{ errorText }</div>
  </div>);
}
