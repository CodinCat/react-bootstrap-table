import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Const from './Const';
import classSet from 'classnames';
import SelectRowHeaderColumn from './SelectRowHeaderColumn';

class Checkbox extends Component {
  componentDidMount() { this.update(this.props.checked); }
  componentWillReceiveProps(props) { this.update(props.checked); }
  update(checked) {
    ReactDOM.findDOMNode(this).indeterminate = checked === 'indeterminate';
  }
  render() {
    return (
      <div className='tm-custom-checkbox'>
        <input className='react-bs-select-all'
          type='checkbox'
          checked={ this.props.checked }
          onChange={ this.props.onChange } />
        <label></label>
      </div>
    );
  }
}

class TableHeader extends Component {

  render() {
    const containerClasses = classSet(
      'react-bs-container-header',
      'table-header-wrapper',
      this.props.headerContainerClass);
    const tableClasses = classSet('table ddes-table', 'table-hover', {
      'table-bordered': this.props.bordered,
      'table-condensed': this.props.condensed
    }, this.props.tableHeaderClass);
    let selectRowHeaderCol = null;
    if (!this.props.hideSelectColumn) selectRowHeaderCol = this.renderSelectRowHeader();
    let i = 0;
    const caption = typeof this.props.caption === 'undefined'
      ? undefined
      : <caption>{ this.props.caption }</caption>;
    return (
      <div ref='container' className={ containerClasses } style={ this.props.style }>
        <table className={ tableClasses }>{ caption }
          <thead>
            <tr ref='header'>
              { selectRowHeaderCol }
              {
                React.Children.map(this.props.children, (elm) => {
                  const { sortIndicator, sortName, sortOrder, onSort } = this.props;
                  const { dataField, dataSort } = elm.props;
                  const sort = (dataSort && dataField === sortName) ? sortOrder : undefined;
                  return React.cloneElement(elm, { key: i++, onSort, sort, sortIndicator });
                })
              }
            </tr>
          </thead>
        </table>
      </div>
    );
  }

  renderSelectRowHeader() {
    if (this.props.customComponent) {
      const CustomComponent = this.props.customComponent;
      return (
        <SelectRowHeaderColumn>
          <CustomComponent type='checkbox' checked={ this.props.isSelectAll }
            indeterminate={ this.props.isSelectAll === 'indeterminate' } disabled={ false }
            onChange={ this.props.onSelectAllRow } rowIndex='Header'/>
        </SelectRowHeaderColumn>
      );
    } else if (this.props.rowSelectType === Const.ROW_SELECT_SINGLE) {
      return (<SelectRowHeaderColumn />);
    } else if (this.props.rowSelectType === Const.ROW_SELECT_MULTI) {
      return (
        <SelectRowHeaderColumn className='col-chkbox'>
          <Checkbox
            onChange={ this.props.onSelectAllRow }
            checked={ this.props.isSelectAll }/>
        </SelectRowHeaderColumn>
      );
    } else {
      return null;
    }
  }
}
TableHeader.propTypes = {
  headerContainerClass: PropTypes.string,
  tableHeaderClass: PropTypes.string,
  caption: PropTypes.oneOfType([ PropTypes.element, PropTypes.string ]),
  style: PropTypes.object,
  rowSelectType: PropTypes.string,
  onSort: PropTypes.func,
  onSelectAllRow: PropTypes.func,
  sortName: PropTypes.string,
  sortOrder: PropTypes.string,
  hideSelectColumn: PropTypes.bool,
  bordered: PropTypes.bool,
  condensed: PropTypes.bool,
  isFiltered: PropTypes.bool,
  isSelectAll: PropTypes.oneOf([ true, 'indeterminate', false ]),
  sortIndicator: PropTypes.bool,
  customComponent: PropTypes.func
};

export default TableHeader;
