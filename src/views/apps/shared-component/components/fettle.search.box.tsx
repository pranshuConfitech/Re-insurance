// import React, { useState } from "react";

// import { InputText } from "primereact/inputtext";
// import 'primeflex/primeflex.css';
// import { IconButton, InputAdornment, TextField } from "@mui/material";
// import { Clear, Search } from "@mui/icons-material";


// export const FettleSearchBox = ({ loading, lastSearchKey, label, onChange }: { loading: boolean, lastSearchKey: string, label: string, onChange: (value: string) => void }) => {
//   const [value, setValue] = useState(lastSearchKey || "");
//   const [isFocused, setIsFocused] = useState(false)

//   const handleFocus = () => {
//     setIsFocused(true)
//   }

//   const handleBlur = () => {
//     setIsFocused(false)
//   }

//   const handleChange = (e: any) => {
//     setValue(e.target.value);
//     onChange(e.target.value);
//   };

//   const clearSearch = () => {
//     setValue('');
//     onChange('')
//     setIsFocused(true)
//   }

//   console.log(' value at searchbox', value)

//   return (
//     <div className="flex justify-content-center align-items-center w-full">
//       <TextField
//         value={value}
//         onChange={handleChange}
//         placeholder={label || "Search"}
//         fullWidth
//         onFocus={handleFocus}
//         disabled={loading}
//         onBlur={handleBlur}
//         focused={isFocused}
//         // className={isFocused ? "bg-[#D80E51]/90 text-white" : 'text-white'}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <Search fontSize='medium' />
//             </InputAdornment>
//           ),
//           endAdornment: (
//             <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={clearSearch}>
//               <IconButton disabled={loading} aria-label="clear" size="small" >
//                 <Clear fontSize="medium" />
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//         sx={{
//           height: "48px",
//           backgroundColor: 'inherit',
//           borderRadius: "6px",
//           // '& .MuiOutlinedInput-root': {
//           //   '& fieldset': {
//           //     borderColor: 'white !important',
//           //   },
//           //   '&:hover fieldset': {
//           //     borderColor: 'white !important',
//           //   },
//           //   '&.Mui-focused fieldset': {
//           //     borderColor: 'white !important',
//           //   },
//           //   color: 'white',
//           // },
//           // '& .MuiInputLabel-root': {
//           //   color: 'white',
//           // },
//           // '& .MuiInputLabel-root.Mui-focused': {
//           //   color: 'white',
//           // },
//         }}
//       />
//     </div>
//   );
// };









import React, { useState, useEffect, useRef, memo } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";

export const FettleSearchBox = memo(({
  loading,
  lastSearchKey,
  label,
  onChange
}: {
  loading: boolean,
  lastSearchKey: string,
  label: string,
  onChange: (value: string) => void
}) => {
  const [value, setValue] = useState(lastSearchKey || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const wasFocusedRef = useRef(false);

  // Sync value with lastSearchKey only when it changes externally (not from user input)
  useEffect(() => {
    if (lastSearchKey !== value && !inputRef.current?.matches(':focus')) {
      setValue(lastSearchKey || "");
    }
  }, [lastSearchKey]);

  // Restore focus if it was focused before re-render
  useEffect(() => {
    if (wasFocusedRef.current && inputRef.current && document.activeElement !== inputRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (inputRef.current && wasFocusedRef.current) {
          inputRef.current.focus();
          // Set cursor position to end of text
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      });
    }
  });

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  const clearSearch = () => {
    setValue('');
    onChange('');
    // Maintain focus after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div style={{ flex: 1, maxWidth: '800px', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder={label || "Search by code, name, type, contact"}
        value={value}
        onChange={handleChange}
        disabled={loading}
        style={{
          width: '100%',
          padding: '8px 40px 8px 12px',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s',
          backgroundColor: loading ? '#f8f9fa' : '#ffffff',
          cursor: loading ? 'not-allowed' : 'text',
          color: '#495057',
          fontFamily: 'inherit'
        }}
        onFocus={(e) => {
          if (!loading) {
            e.target.style.borderColor = '#007bff';
          }
          wasFocusedRef.current = true;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#dee2e6';
          wasFocusedRef.current = false;
        }}
      />
      {value && !loading && (
        <div
          onClick={clearSearch}
          style={{
            position: 'relative',
            float: 'right',
            marginTop: '-32px',
            marginRight: '8px',
            cursor: 'pointer',
            color: '#6c757d',
            fontSize: '20px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#495057';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#6c757d';
          }}
        >
          ×
        </div>
      )}
    </div>
  );
});






{/*import { InputAdornment, TextField } from "@material-ui/core";


import SearchIcon from '@material-ui/icons/Search';
import React from "react";


export const FettleSearchBox = (props) => {
  const inputStyle = {
    borderRadius: '24px',
    fontSize: '16px',
    width: 'auto',
  };
  const onChange = (e) => {
    Object.prototype.toString.call(props.onChange) == "[object Function]" &&
      props.onChange(e.target.value);
  }

  return <TextField size="small" onChange={onChange} label={props.label || 'Search'} type="search" variant="outlined" fullWidth
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <SearchIcon />
        </InputAdornment>
      ),
      style: inputStyle,
    }}
  />

}*/}
