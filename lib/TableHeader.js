'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _SelectRowHeaderColumn = require('./SelectRowHeaderColumn');

var _SelectRowHeaderColumn2 = _interopRequireDefault(_SelectRowHeaderColumn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Checkbox = function (_Component) {
  _inherits(Checkbox, _Component);

  function Checkbox() {
    _classCallCheck(this, Checkbox);

    return _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).apply(this, arguments));
  }

  _createClass(Checkbox, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.update(this.props.checked);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      this.update(props.checked);
    }
  }, {
    key: 'update',
    value: function update(checked) {
      _reactDom2.default.findDOMNode(this).indeterminate = checked === 'indeterminate';
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'tm-custom-checkbox' },
        _react2.default.createElement('input', { className: 'react-bs-select-all',
          type: 'checkbox',
          checked: this.props.checked,
          onChange: this.props.onChange }),
        _react2.default.createElement('label', null)
      );
    }
  }]);

  return Checkbox;
}(_react.Component);

var TableHeader = function (_Component2) {
  _inherits(TableHeader, _Component2);

  function TableHeader() {
    _classCallCheck(this, TableHeader);

    return _possibleConstructorReturn(this, (TableHeader.__proto__ || Object.getPrototypeOf(TableHeader)).apply(this, arguments));
  }

  _createClass(TableHeader, [{
    key: 'render',
    value: function render() {
      var _this3 = this;

      var containerClasses = (0, _classnames2.default)('react-bs-container-header', 'table-header-wrapper', this.props.headerContainerClass);
      var tableClasses = (0, _classnames2.default)('table ddes-table', 'table-hover', {
        'table-bordered': this.props.bordered,
        'table-condensed': this.props.condensed
      }, this.props.tableHeaderClass);
      var selectRowHeaderCol = null;
      if (!this.props.hideSelectColumn) selectRowHeaderCol = this.renderSelectRowHeader();
      var i = 0;
      var caption = typeof this.props.caption === 'undefined' ? undefined : _react2.default.createElement(
        'caption',
        null,
        this.props.caption
      );
      return _react2.default.createElement(
        'div',
        { ref: 'container', className: containerClasses, style: this.props.style },
        _react2.default.createElement(
          'table',
          { className: tableClasses },
          caption,
          _react2.default.createElement(
            'thead',
            null,
            _react2.default.createElement(
              'tr',
              { ref: 'header' },
              selectRowHeaderCol,
              _react2.default.Children.map(this.props.children, function (elm) {
                var _props = _this3.props,
                    sortIndicator = _props.sortIndicator,
                    sortName = _props.sortName,
                    sortOrder = _props.sortOrder,
                    onSort = _props.onSort;
                var _elm$props = elm.props,
                    dataField = _elm$props.dataField,
                    dataSort = _elm$props.dataSort;

                var sort = dataSort && dataField === sortName ? sortOrder : undefined;
                return _react2.default.cloneElement(elm, { key: i++, onSort: onSort, sort: sort, sortIndicator: sortIndicator });
              })
            )
          )
        )
      );
    }
  }, {
    key: 'renderSelectRowHeader',
    value: function renderSelectRowHeader() {
      if (this.props.customComponent) {
        var CustomComponent = this.props.customComponent;
        return _react2.default.createElement(
          _SelectRowHeaderColumn2.default,
          null,
          _react2.default.createElement(CustomComponent, { type: 'checkbox', checked: this.props.isSelectAll,
            indeterminate: this.props.isSelectAll === 'indeterminate', disabled: false,
            onChange: this.props.onSelectAllRow, rowIndex: 'Header' })
        );
      } else if (this.props.rowSelectType === _Const2.default.ROW_SELECT_SINGLE) {
        return _react2.default.createElement(_SelectRowHeaderColumn2.default, null);
      } else if (this.props.rowSelectType === _Const2.default.ROW_SELECT_MULTI) {
        return _react2.default.createElement(
          _SelectRowHeaderColumn2.default,
          { className: 'col-chkbox' },
          _react2.default.createElement(Checkbox, {
            onChange: this.props.onSelectAllRow,
            checked: this.props.isSelectAll })
        );
      } else {
        return null;
      }
    }
  }]);

  return TableHeader;
}(_react.Component);

TableHeader.propTypes = {
  headerContainerClass: _propTypes2.default.string,
  tableHeaderClass: _propTypes2.default.string,
  caption: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.string]),
  style: _propTypes2.default.object,
  rowSelectType: _propTypes2.default.string,
  onSort: _propTypes2.default.func,
  onSelectAllRow: _propTypes2.default.func,
  sortName: _propTypes2.default.string,
  sortOrder: _propTypes2.default.string,
  hideSelectColumn: _propTypes2.default.bool,
  bordered: _propTypes2.default.bool,
  condensed: _propTypes2.default.bool,
  isFiltered: _propTypes2.default.bool,
  isSelectAll: _propTypes2.default.oneOf([true, 'indeterminate', false]),
  sortIndicator: _propTypes2.default.bool,
  customComponent: _propTypes2.default.func
};

exports.default = TableHeader;