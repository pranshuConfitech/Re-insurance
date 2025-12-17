
import React from 'react';

import { useRouter } from 'next/navigation';

import { createStyles, withStyles } from '@mui/styles';


import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DraggableBox } from './draggable.box';


const useStyles = (theme:any) => createStyles({
  searchBox: {
    width: '100%',
  },
  listContainer: {
    height: 400,
    overflowY: 'auto',
    marginTop: 10,
  },
  listElm: {
    // padding: 10,
    margin: '5px 0 !important',
    cursor: 'pointer',
    boxShadow: '0.25rem 0.25rem 0.6rem rgb(0 0 0 / 5%), 0 0.5rem 1.125rem rgb(75 0 0 / 5%)',
    background: 'white',
    borderRadius: '0 0.5rem 0.5rem 0.5rem',
    counterIncrement: 'gradient-counter',
    marginTop: '1rem',
    minHeight: '3rem',
    padding: '1rem 1rem 1rem 3rem',
    position: 'relative',
  },
  boxSelected: {
    background: 'linear-gradient(135deg, #83e4e2 0%, #0207b5 100%)',
    color: '#fff',
  },
});

function withRouter(Component: any) {
  return function WrappedComponent(props:any) {
      const router = useRouter();

      
return <Component {...props} router={router} />;
  };
}

class SidemenuDraggable extends React.Component<any,any> {
  constructor(props:any) {
    super(props);

    this.state = {
      data: this.props.data,
      filteredData: this.props.data,
    };
  }

  componentDidUpdate(prevProps:any) {
    if (prevProps.data != this.props.data) {
      this.setState({
        ...this.state,
        data: this.props.data,
        filteredData: this.props.data,
      });
    }
  }

  handleSearch = (e:any) => {
    const { value } = e.target;

    if (!value) {
      this.setState({
        ...this.state,
        filteredData: this.state.data,
      });
    } else if (value && value.length > 2) {
      const filterData = this.state.data.filter((d:any) => d.value.toLowerCase().indexOf(value.toLowerCase()) > -1);

      this.setState({
        ...this.state,
        filteredData: filterData,
      });
    }
  };

  handleClick = (d:any) => {
    if (!this.props.dragable) {
      Object.prototype.toString.call(this.props.handleClick) == '[object Function]' && this.props.handleClick(d);
    }
  };

  render() {
    const { classes, type, selectedRoleId, draggable } = this.props;
    const { filteredData } = this.state;

    return (
      <div>
        <TextField
          id={`${type}SearchBox`}
          label={`Search ${type}`}
          variant="standard"
          className={classes.searchBox}
          onChange={this.handleSearch}
        />
        <div className={classes.listContainer}>
          {filteredData.map((d:any) => {
            if (draggable) {
              return (
                <Typography key={`${type}-${d.id}`} component="span">
                  <DraggableBox name={d.value} id={d.id} type={type} draggable={draggable} />
                </Typography>
              );
            } else {
              return (
                <Typography
                  key={d.id}
                  className={`${classes.listElm} ${selectedRoleId === d.id && classes.boxSelected}`}
                  onClick={() => this.handleClick(d)}>
                  {d.value}
                </Typography>
              );
            }
          })}
        </div>
      </div>
    );
  }
}
export default withRouter(withStyles(useStyles)(SidemenuDraggable));
