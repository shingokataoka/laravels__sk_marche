import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectCategory({
    primaryCategories,
    secondary_category_id, setSecondaryCategoryId,
}) {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
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
  );
}
