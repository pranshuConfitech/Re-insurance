import React from 'react';
import { useRouter } from 'next/navigation';
import { createStyles, withStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DraggableBox } from './draggable.box';

const useStyles = (theme: any) => createStyles({
  searchBox: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      background: '#ffffff',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 2px 8px rgba(216, 14, 81, 0.1)'
      },
      '&.Mui-focused': {
        boxShadow: '0 4px 12px rgba(216, 14, 81, 0.15)'
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#D80E51'
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#D80E51',
      borderWidth: '2px'
    }
  },
  listContainer: {
    height: 400,
    overflowY: 'auto',
    marginTop: '16px',
    paddingRight: '8px',
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'linear-gradient(135deg, #D80E51 0%, #ff4081 100%)',
      borderRadius: '4px',
      '&:hover': {
        background: '#D80E51'
      }
    }
  },
  listElm: {
    margin: '8px 0 !important',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    borderRadius: '8px',
    minHeight: '48px',
    padding: '12px 16px',
    position: 'relative',
    border: '2px solid transparent',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    fontSize: '0.875rem',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '4px',
      height: '60%',
      background: 'linear-gradient(135deg, #D80E51 0%, #ff4081 100%)',
      borderRadius: '0 4px 4px 0',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    '&:hover': {
      transform: 'translateX(4px)',
      boxShadow: '0 4px 16px rgba(216, 14, 81, 0.2)',
      borderColor: 'rgba(216, 14, 81, 0.3)',
      '&::before': {
        opacity: 1
      }
    },
    '&:active': {
      transform: 'scale(0.98)'
    }
  },
  boxSelected: {
    background: 'linear-gradient(135deg, #D80E51 0%, #ff4081 100%) !important',
    color: '#ffffff !important',
    borderColor: '#D80E51 !important',
    boxShadow: '0 6px 20px rgba(216, 14, 81, 0.4) !important',
    transform: 'translateX(4px)',
    '&::before': {
      opacity: 0
    },
    '&:hover': {
      transform: 'translateX(6px)',
      boxShadow: '0 8px 24px rgba(216, 14, 81, 0.5) !important'
    }
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#999',
    fontSize: '0.875rem',
    fontStyle: 'italic'
  },
  badge: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(216, 14, 81, 0.1)',
    color: '#D80E51',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 700
  }
});

function withRouter(Component: any) {
  return function WrappedComponent(props: any) {
    const router = useRouter();
    return <Component {...props} router={router} />;
  };
}

class SidemenuDraggable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: this.props.data,
      filteredData: this.props.data,
      searchValue: ''
    };
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.data != this.props.data) {
      this.setState({
        ...this.state,
        data: this.props.data,
        filteredData: this.props.data,
      });
    }
  }

  handleSearch = (e: any) => {
    const { value } = e.target;
    this.setState({ searchValue: value });

    if (!value) {
      this.setState({
        ...this.state,
        filteredData: this.state.data,
      });
    } else if (value && value.length > 2) {
      const filterData = this.state.data.filter((d: any) =>
        d.value.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      this.setState({
        ...this.state,
        filteredData: filterData,
      });
    }
  };

  handleClick = (d: any) => {
    if (!this.props.dragable) {
      Object.prototype.toString.call(this.props.handleClick) == '[object Function]' &&
        this.props.handleClick(d);
    }
  };

  render() {
    const { classes, type, selectedRoleId, draggable, onDoubleClick } = this.props;
    const { filteredData, searchValue } = this.state;

    return (
      <Box>
        <TextField
          id={`${type}SearchBox`}
          label={`Search ${type}`}
          variant="outlined"
          size="small"
          className={classes.searchBox}
          onChange={this.handleSearch}
          value={searchValue}
          InputProps={{
            endAdornment: searchValue && (
              <Box
                component="span"
                onClick={() => this.handleSearch({ target: { value: '' } })}
                style={{
                  cursor: 'pointer',
                  color: '#999',
                  fontSize: '1.2rem',
                  padding: '0 4px'
                }}
              >
                ×
              </Box>
            )
          }}
        />
        <div className={classes.listContainer}>
          {filteredData.length === 0 ? (
            <Box className={classes.emptyState}>
              <i className="pi pi-inbox" style={{ fontSize: '2rem', opacity: 0.3, marginBottom: '8px', display: 'block' }}></i>
              No {type}s found
            </Box>
          ) : (
            filteredData.map((d: any, index: number) => {
              if (draggable) {
                return (
                  <Typography key={`${type}-${d.id}`} component="span">
                    <DraggableBox
                      name={d.value}
                      id={d.id}
                      type={type}
                      draggable={draggable}
                      onDoubleClick={onDoubleClick}
                    />
                  </Typography>
                );
              } else {
                return (
                  <Typography
                    key={d.id}
                    className={`${classes.listElm} ${selectedRoleId === d.id && classes.boxSelected}`}
                    onClick={() => this.handleClick(d)}
                  >
                    {d.value}
                    {selectedRoleId === d.id && (
                      <span className={classes.badge}>✓</span>
                    )}
                  </Typography>
                );
              }
            })
          )}
        </div>
      </Box>
    );
  }
}

export default withRouter(withStyles(useStyles)(SidemenuDraggable));

// import React from 'react';

// import { useRouter } from 'next/navigation';

// import { createStyles, withStyles } from '@mui/styles';


// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';

// import { DraggableBox } from './draggable.box';


// const useStyles = (theme: any) => createStyles({
//   searchBox: {
//     width: '100%',
//   },
//   listContainer: {
//     height: 400,
//     overflowY: 'auto',
//     marginTop: 10,
//   },
//   listElm: {
//     // padding: 10,
//     margin: '5px 0 !important',
//     cursor: 'pointer',
//     boxShadow: '0.25rem 0.25rem 0.6rem rgb(0 0 0 / 5%), 0 0.5rem 1.125rem rgb(75 0 0 / 5%)',
//     background: 'white',
//     borderRadius: '0 0.5rem 0.5rem 0.5rem',
//     counterIncrement: 'gradient-counter',
//     marginTop: '1rem',
//     minHeight: '3rem',
//     padding: '1rem 1rem 1rem 3rem',
//     position: 'relative',
//   },
//   boxSelected: {
//     background: 'linear-gradient(135deg, #83e4e2 0%, #0207b5 100%)',
//     color: '#fff',
//   },
// });

// function withRouter(Component: any) {
//   return function WrappedComponent(props: any) {
//     const router = useRouter();


//     return <Component {...props} router={router} />;
//   };
// }

// class SidemenuDraggable extends React.Component<any, any> {
//   constructor(props: any) {
//     super(props);

//     this.state = {
//       data: this.props.data,
//       filteredData: this.props.data,
//     };
//   }

//   componentDidUpdate(prevProps: any) {
//     if (prevProps.data != this.props.data) {
//       this.setState({
//         ...this.state,
//         data: this.props.data,
//         filteredData: this.props.data,
//       });
//     }
//   }

//   handleSearch = (e: any) => {
//     const { value } = e.target;

//     if (!value) {
//       this.setState({
//         ...this.state,
//         filteredData: this.state.data,
//       });
//     } else if (value && value.length > 2) {
//       const filterData = this.state.data.filter((d: any) => d.value.toLowerCase().indexOf(value.toLowerCase()) > -1);

//       this.setState({
//         ...this.state,
//         filteredData: filterData,
//       });
//     }
//   };

//   handleClick = (d: any) => {
//     if (!this.props.dragable) {
//       Object.prototype.toString.call(this.props.handleClick) == '[object Function]' && this.props.handleClick(d);
//     }
//   };

//   render() {
//     const { classes, type, selectedRoleId, draggable, onDoubleClick } = this.props;
//     const { filteredData } = this.state;

//     return (
//       <div>
//         <TextField
//           id={`${type}SearchBox`}
//           label={`Search ${type}`}
//           variant="standard"
//           className={classes.searchBox}
//           onChange={this.handleSearch}
//         />
//         <div className={classes.listContainer}>
//           {filteredData.map((d: any) => {
//             if (draggable) {
//               return (
//                 <Typography key={`${type}-${d.id}`} component="span">
//                   <DraggableBox name={d.value} id={d.id} type={type} draggable={draggable} />
//                 </Typography>
//               );
//             } else {
//               return (
//                 <Typography
//                   key={d.id}
//                   className={`${classes.listElm} ${selectedRoleId === d.id && classes.boxSelected}`}
//                   onClick={() => this.handleClick(d)}>
//                   {d.value}
//                 </Typography>
//               );
//             }
//           })}
//         </div>
//       </div>
//     );
//   }
// }
// export default withRouter(withStyles(useStyles)(SidemenuDraggable));

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { createStyles, withStyles } from '@mui/styles';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import { DraggableBox } from './draggable.box';

// const useStyles = (theme: any) => createStyles({
//   searchBox: {
//     width: '100%',
//     '& .MuiOutlinedInput-root': {
//       borderRadius: '8px',
//       background: '#ffffff',
//       transition: 'all 0.3s ease',
//       '&:hover': {
//         boxShadow: '0 2px 8px rgba(216, 14, 81, 0.1)'
//       },
//       '&.Mui-focused': {
//         boxShadow: '0 4px 12px rgba(216, 14, 81, 0.15)'
//       }
//     },
//     '& .MuiInputLabel-root.Mui-focused': {
//       color: '#D80E51'
//     },
//     '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
//       borderColor: '#D80E51',
//       borderWidth: '2px'
//     }
//   },
//   listContainer: {
//     height: 400,
//     overflowY: 'auto',
//     marginTop: '16px',
//     paddingRight: '8px',
//     '&::-webkit-scrollbar': {
//       width: '6px'
//     },
//     '&::-webkit-scrollbar-track': {
//       background: '#f1f1f1',
//       borderRadius: '4px'
//     },
//     '&::-webkit-scrollbar-thumb': {
//       background: 'linear-gradient(135deg, #D80E51 0%, #ff4081 100%)',
//       borderRadius: '4px',
//       '&:hover': {
//         background: '#D80E51'
//       }
//     }
//   },
//   listElm: {
//     margin: '8px 0 !important',
//     cursor: 'pointer',
//     background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
//     borderRadius: '8px',
//     minHeight: '48px',
//     padding: '12px 16px',
//     position: 'relative',
//     border: '2px solid transparent',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
//     display: 'flex',
//     alignItems: 'center',
//     fontWeight: 500,
//     fontSize: '0.875rem',
//     '&::before': {
//       content: '""',
//       position: 'absolute',
//       left: 0,
//       top: '50%',
//       transform: 'translateY(-50%)',
//       width: '4px',
//       height: '60%',
//       background: 'linear-gradient(135deg, #D80E51 0%, #ff4081 100%)',
//       borderRadius: '0 4px 4px 0',
//       opacity: 0,
//       transition: 'opacity 0.3s ease'
//     },
//     '&:hover': {
//       transform: 'translateX(4px)',
//       boxShadow: '0 4px 16px rgba(216, 14, 81, 0.2)',
//       borderColor: 'rgba(216, 14, 81, 0.3)',
//       '&::before': {
//         opacity: 1
//       }
//     },
//     '&:active': {
//       transform: 'scale(0.98)'
//     }
//   },
//   boxSelected: {
//     background: 'linear-gradient(135deg, #D80E51 0%, #ff4081 100%) !important',
//     color: '#ffffff !important',
//     borderColor: '#D80E51 !important',
//     boxShadow: '0 6px 20px rgba(216, 14, 81, 0.4) !important',
//     transform: 'translateX(4px)',
//     '&::before': {
//       opacity: 0
//     },
//     '&:hover': {
//       transform: 'translateX(6px)',
//       boxShadow: '0 8px 24px rgba(216, 14, 81, 0.5) !important'
//     }
//   },
//   emptyState: {
//     textAlign: 'center',
//     padding: '40px 20px',
//     color: '#999',
//     fontSize: '0.875rem',
//     fontStyle: 'italic'
//   },
//   badge: {
//     position: 'absolute',
//     right: '12px',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     background: 'rgba(216, 14, 81, 0.1)',
//     color: '#D80E51',
//     padding: '2px 8px',
//     borderRadius: '12px',
//     fontSize: '0.7rem',
//     fontWeight: 700
//   }
// });

// function withRouter(Component: any) {
//   return function WrappedComponent(props: any) {
//     const router = useRouter();
//     return <Component {...props} router={router} />;
//   };
// }

// class SidemenuDraggable extends React.Component<any, any> {
//   constructor(props: any) {
//     super(props);
//     this.state = {
//       data: this.props.data,
//       filteredData: this.props.data,
//       searchValue: ''
//     };
//   }

//   componentDidUpdate(prevProps: any) {
//     if (prevProps.data != this.props.data) {
//       this.setState({
//         ...this.state,
//         data: this.props.data,
//         filteredData: this.props.data,
//       });
//     }
//   }

//   handleSearch = (e: any) => {
//     const { value } = e.target;
//     this.setState({ searchValue: value });

//     if (!value) {
//       this.setState({
//         ...this.state,
//         filteredData: this.state.data,
//       });
//     } else if (value && value.length > 2) {
//       const filterData = this.state.data.filter((d: any) =>
//         d.value.toLowerCase().indexOf(value.toLowerCase()) > -1
//       );
//       this.setState({
//         ...this.state,
//         filteredData: filterData,
//       });
//     }
//   };

//   handleClick = (d: any) => {
//     if (!this.props.dragable) {
//       Object.prototype.toString.call(this.props.handleClick) == '[object Function]' &&
//         this.props.handleClick(d);
//     }
//   };

//   render() {
//     const { classes, type, selectedRoleId, draggable } = this.props;
//     const { filteredData, searchValue } = this.state;

//     return (
//       <Box>
//         <TextField
//           id={`${type}SearchBox`}
//           label={`Search ${type}`}
//           variant="outlined"
//           size="small"
//           className={classes.searchBox}
//           onChange={this.handleSearch}
//           value={searchValue}
//           InputProps={{
//             endAdornment: searchValue && (
//               <Box
//                 component="span"
//                 onClick={() => this.handleSearch({ target: { value: '' } })}
//                 style={{
//                   cursor: 'pointer',
//                   color: '#999',
//                   fontSize: '1.2rem',
//                   padding: '0 4px'
//                 }}
//               >
//                 ×
//               </Box>
//             )
//           }}
//         />
//         <div className={classes.listContainer}>
//           {filteredData.length === 0 ? (
//             <Box className={classes.emptyState}>
//               <i className="pi pi-inbox" style={{ fontSize: '2rem', opacity: 0.3, marginBottom: '8px', display: 'block' }}></i>
//               No {type}s found
//             </Box>
//           ) : (
//             filteredData.map((d: any, index: number) => {
//               if (draggable) {
//                 return (
//                   <Typography key={`${type}-${d.id}`} component="span">
//                     <DraggableBox
//                       name={d.value}
//                       id={d.id}
//                       type={type}
//                       draggable={draggable}
//                     />
//                   </Typography>
//                 );
//               } else {
//                 return (
//                   <Typography
//                     key={d.id}
//                     className={`${classes.listElm} ${selectedRoleId === d.id && classes.boxSelected}`}
//                     onClick={() => this.handleClick(d)}
//                   >
//                     {d.value}
//                     {selectedRoleId === d.id && (
//                       <span className={classes.badge}>✓</span>
//                     )}
//                   </Typography>
//                 );
//               }
//             })
//           )}
//         </div>
//       </Box>
//     );
//   }
// }

// export default withRouter(withStyles(useStyles)(SidemenuDraggable));
