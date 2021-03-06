'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _TableHeader = require('./TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _TableBody = require('./TableBody');

var _TableBody2 = _interopRequireDefault(_TableBody);

var _PaginationList = require('./pagination/PaginationList');

var _PaginationList2 = _interopRequireDefault(_PaginationList);

var _ToolBar = require('./toolbar/ToolBar');

var _ToolBar2 = _interopRequireDefault(_ToolBar);

var _TableFilter = require('./TableFilter');

var _TableFilter2 = _interopRequireDefault(_TableFilter);

var _TableDataStore = require('./store/TableDataStore');

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _csv_export_util = require('./csv_export_util');

var _csv_export_util2 = _interopRequireDefault(_csv_export_util);

var _Filter = require('./Filter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* eslint no-alert: 0 */
/* eslint max-len: 0 */


var BootstrapTable = function (_Component) {
  _inherits(BootstrapTable, _Component);

  function BootstrapTable(props) {
    _classCallCheck(this, BootstrapTable);

    var _this = _possibleConstructorReturn(this, (BootstrapTable.__proto__ || Object.getPrototypeOf(BootstrapTable)).call(this, props));

    _this.handleSort = function (order, sortField) {
      if (_this.props.options.onSortChange) {
        _this.props.options.onSortChange(sortField, order, _this.props);
      }

      if (_this.isRemoteDataSource()) {
        _this.store.setSortInfo(order, sortField);
        return;
      }

      var result = _this.store.sort(order, sortField).get();
      _this.setState({
        data: result
      });
    };

    _this.handlePaginationData = function (page, sizePerPage) {
      var _this$props$options = _this.props.options,
          onPageChange = _this$props$options.onPageChange,
          pageStartIndex = _this$props$options.pageStartIndex;

      if (onPageChange) {
        onPageChange(page, sizePerPage);
      }

      _this.setState({
        currPage: page,
        sizePerPage: sizePerPage
      });

      if (_this.isRemoteDataSource()) {
        return;
      }

      // We calculate an offset here in order to properly fetch the indexed data,
      // despite the page start index not always being 1
      var normalizedPage = void 0;
      if (pageStartIndex !== undefined) {
        var offset = Math.abs(_Const2.default.PAGE_START_INDEX - pageStartIndex);
        normalizedPage = page + offset;
      } else {
        normalizedPage = page;
      }

      var result = _this.store.page(normalizedPage, sizePerPage).get();

      _this.setState({ data: result });
    };

    _this.handleMouseLeave = function () {
      if (_this.props.options.onMouseLeave) {
        _this.props.options.onMouseLeave();
      }
    };

    _this.handleMouseEnter = function () {
      if (_this.props.options.onMouseEnter) {
        _this.props.options.onMouseEnter();
      }
    };

    _this.handleRowMouseOut = function (row, event) {
      if (_this.props.options.onRowMouseOut) {
        _this.props.options.onRowMouseOut(row, event);
      }
    };

    _this.handleRowMouseOver = function (row, event) {
      if (_this.props.options.onRowMouseOver) {
        _this.props.options.onRowMouseOver(row, event);
      }
    };

    _this.handleRowClick = function (row) {
      if (_this.props.options.onRowClick) {
        _this.props.options.onRowClick(row);
      }
    };

    _this.handleSelectAllRow = function (e) {
      var isSelected = e.currentTarget.checked;
      var keyField = _this.store.getKeyField();
      var _this$props$selectRow = _this.props.selectRow,
          onSelectAll = _this$props$selectRow.onSelectAll,
          unselectable = _this$props$selectRow.unselectable,
          selected = _this$props$selectRow.selected;

      var selectedRowKeys = [];
      var result = true;
      var rows = isSelected ? _this.store.get() : _this.store.getRowByKey(_this.state.selectedRowKeys);

      if (unselectable && unselectable.length > 0) {
        if (isSelected) {
          rows = rows.filter(function (r) {
            return unselectable.indexOf(r[keyField]) === -1 || selected && selected.indexOf(r[keyField]) !== -1;
          });
        } else {
          rows = rows.filter(function (r) {
            return unselectable.indexOf(r[keyField]) === -1;
          });
        }
      }

      if (onSelectAll) {
        result = _this.props.selectRow.onSelectAll(isSelected, rows);
      }

      if (typeof result == 'undefined' || result !== false) {
        if (isSelected) {
          selectedRowKeys = Array.isArray(result) ? result : rows.map(function (r) {
            return r[keyField];
          });
        } else {
          if (unselectable && selected) {
            selectedRowKeys = selected.filter(function (r) {
              return unselectable.indexOf(r) > -1;
            });
          }
        }

        _this.store.setSelectedRowKey(selectedRowKeys);
        _this.setState({ selectedRowKeys: selectedRowKeys });
      }
    };

    _this.handleShowOnlySelected = function () {
      _this.store.ignoreNonSelected();
      var result = void 0;
      if (_this.props.pagination) {
        result = _this.store.page(1, _this.state.sizePerPage).get();
      } else {
        result = _this.store.get();
      }
      _this.setState({
        data: result,
        currPage: _this.props.options.pageStartIndex || _Const2.default.PAGE_START_INDEX
      });
    };

    _this.handleSelectRow = function (row, isSelected, e) {
      var result = true;
      var currSelected = _this.store.getSelectedRowKeys();
      var rowKey = row[_this.store.getKeyField()];
      var selectRow = _this.props.selectRow;

      if (selectRow.onSelect) {
        result = selectRow.onSelect(row, isSelected, e);
      }

      if (typeof result === 'undefined' || result !== false) {
        if (selectRow.mode === _Const2.default.ROW_SELECT_SINGLE) {
          currSelected = isSelected ? [rowKey] : [];
        } else {
          if (isSelected) {
            currSelected.push(rowKey);
          } else {
            currSelected = currSelected.filter(function (key) {
              return rowKey !== key;
            });
          }
        }

        _this.store.setSelectedRowKey(currSelected);
        _this.setState({
          selectedRowKeys: currSelected
        });
      }
    };

    _this.handleAddRow = function (newObj) {
      var onAddRow = _this.props.options.onAddRow;

      if (onAddRow) {
        var colInfos = _this.store.getColInfos();
        onAddRow(newObj, colInfos);
      }

      if (_this.isRemoteDataSource()) {
        if (_this.props.options.afterInsertRow) {
          _this.props.options.afterInsertRow(newObj);
        }
        return null;
      }

      try {
        _this.store.add(newObj);
      } catch (e) {
        return e;
      }
      _this._handleAfterAddingRow(newObj);
    };

    _this.getPageByRowKey = function (rowKey) {
      var sizePerPage = _this.state.sizePerPage;

      var currentData = _this.store.getCurrentDisplayData();
      var keyField = _this.store.getKeyField();
      var result = currentData.findIndex(function (x) {
        return x[keyField] === rowKey;
      });
      if (result > -1) {
        return parseInt(result / sizePerPage, 10) + 1;
      } else {
        return result;
      }
    };

    _this.handleDropRow = function (rowKeys) {
      var dropRowKeys = rowKeys ? rowKeys : _this.store.getSelectedRowKeys();
      // add confirm before the delete action if that option is set.
      if (dropRowKeys && dropRowKeys.length > 0) {
        if (_this.props.options.handleConfirmDeleteRow) {
          _this.props.options.handleConfirmDeleteRow(function () {
            _this.deleteRow(dropRowKeys);
          }, dropRowKeys);
        } else if (confirm('Are you sure you want to delete?')) {
          _this.deleteRow(dropRowKeys);
        }
      }
    };

    _this.handleFilterData = function (filterObj) {
      var onFilterChange = _this.props.options.onFilterChange;

      if (onFilterChange) {
        var colInfos = _this.store.getColInfos();
        onFilterChange(filterObj, colInfos);
      }

      _this.setState({
        currPage: _this.props.options.pageStartIndex || _Const2.default.PAGE_START_INDEX
      });

      if (_this.isRemoteDataSource()) {
        if (_this.props.options.afterColumnFilter) {
          _this.props.options.afterColumnFilter(filterObj, _this.store.getDataIgnoringPagination());
        }
        return;
      }

      _this.store.filter(filterObj);

      var sortObj = _this.store.getSortInfo();

      if (sortObj) {
        _this.store.sort(sortObj.order, sortObj.sortField);
      }

      var result = void 0;

      if (_this.props.pagination) {
        var sizePerPage = _this.state.sizePerPage;

        result = _this.store.page(1, sizePerPage).get();
      } else {
        result = _this.store.get();
      }
      if (_this.props.options.afterColumnFilter) {
        _this.props.options.afterColumnFilter(filterObj, _this.store.getDataIgnoringPagination());
      }
      _this.setState({
        data: result
      });
    };

    _this.handleExportCSV = function () {
      var result = {};

      var csvFileName = _this.props.csvFileName;
      var onExportToCSV = _this.props.options.onExportToCSV;

      if (onExportToCSV) {
        result = onExportToCSV();
      } else {
        result = _this.store.getDataIgnoringPagination();
      }

      var keys = [];
      _this.props.children.map(function (column) {
        if (column.props.export === true || typeof column.props.export === 'undefined' && column.props.hidden === false) {
          keys.push({
            field: column.props.dataField,
            format: column.props.csvFormat,
            header: column.props.csvHeader || column.props.dataField
          });
        }
      });

      if (typeof csvFileName === 'function') {
        csvFileName = csvFileName();
      }

      (0, _csv_export_util2.default)(result, keys, csvFileName);
    };

    _this.handleSearch = function (searchText) {
      var onSearchChange = _this.props.options.onSearchChange;

      if (onSearchChange) {
        var colInfos = _this.store.getColInfos();
        onSearchChange(searchText, colInfos, _this.props.multiColumnSearch);
      }

      _this.setState({
        currPage: _this.props.options.pageStartIndex || _Const2.default.PAGE_START_INDEX
      });

      if (_this.isRemoteDataSource()) {
        if (_this.props.options.afterSearch) {
          _this.props.options.afterSearch(searchText, _this.store.getDataIgnoringPagination());
        }
        return;
      }

      _this.store.search(searchText);

      var sortObj = _this.store.getSortInfo();

      if (sortObj) {
        _this.store.sort(sortObj.order, sortObj.sortField);
      }

      var result = void 0;
      if (_this.props.pagination) {
        var sizePerPage = _this.state.sizePerPage;

        result = _this.store.page(1, sizePerPage).get();
      } else {
        result = _this.store.get();
      }
      if (_this.props.options.afterSearch) {
        _this.props.options.afterSearch(searchText, _this.store.getDataIgnoringPagination());
      }
      _this.setState({
        data: result
      });
    };

    _this._scrollHeader = function (e) {
      _this.refs.header.refs.container.scrollLeft = e.currentTarget.scrollLeft;
    };

    _this._adjustTable = function () {
      _this._adjustHeaderWidth();
      _this._adjustHeight();
    };

    _this._adjustHeaderWidth = function () {
      var header = _this.refs.header.refs.header;
      var headerContainer = _this.refs.header.refs.container;
      var tbody = _this.refs.body.refs.tbody;
      var firstRow = tbody.childNodes[0];
      var isScroll = headerContainer.offsetWidth !== tbody.parentNode.offsetWidth;
      var scrollBarWidth = isScroll ? _util2.default.getScrollBarWidth() : 0;
      if (firstRow && _this.store.getDataNum()) {
        var cells = firstRow.childNodes;
        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          var computedStyle = getComputedStyle(cell);
          var width = parseFloat(computedStyle.width.replace('px', ''));
          if (_this.isIE) {
            var paddingLeftWidth = parseFloat(computedStyle.paddingLeft.replace('px', ''));
            var paddingRightWidth = parseFloat(computedStyle.paddingRight.replace('px', ''));
            var borderRightWidth = parseFloat(computedStyle.borderRightWidth.replace('px', ''));
            var borderLeftWidth = parseFloat(computedStyle.borderLeftWidth.replace('px', ''));
            width = width + paddingLeftWidth + paddingRightWidth + borderRightWidth + borderLeftWidth;
          }
          var lastPadding = cells.length - 1 === i ? scrollBarWidth : 0;
          if (width <= 0) {
            width = 120;
            cell.width = width + lastPadding + 'px';
          }
          var result = width + lastPadding + 'px';
          header.childNodes[i].style.width = result;
          header.childNodes[i].style.minWidth = result;
        }
      } else {
        _react2.default.Children.forEach(_this.props.children, function (child, i) {
          if (header.childNodes[0].classList.contains('col-chkbox')) {
            i++;
          }
          if (child.props.width) {
            header.childNodes[i].style.width = child.props.width + 'px';
            header.childNodes[i].style.minWidth = child.props.width + 'px';
          }
        });
      }
    };

    _this._adjustHeight = function () {
      var height = _this.props.height;
      var maxHeight = _this.props.maxHeight;

      if (typeof height === 'number' && !isNaN(height) || height.indexOf('%') === -1) {
        _this.refs.body.refs.container.style.height = parseFloat(height, 10) - _this.refs.header.refs.container.offsetHeight + 'px';
      }
      if (maxHeight) {
        maxHeight = typeof maxHeight === 'number' ? maxHeight : parseInt(maxHeight.replace('px', ''), 10);

        _this.refs.body.refs.container.style.maxHeight = maxHeight - _this.refs.header.refs.container.offsetHeight + 'px';
      }
    };

    _this.isIE = false;
    _this._attachCellEditFunc();
    if (_util2.default.canUseDOM()) {
      _this.isIE = document.documentMode;
    }

    _this.store = new _TableDataStore.TableDataStore(_this.props.data.slice());

    _this.initTable(_this.props);

    if (_this.filter) {
      _this.filter.on('onFilterChange', function (currentFilter) {
        _this.handleFilterData(currentFilter);
      });
    }

    if (_this.props.selectRow && _this.props.selectRow.selected) {
      var copy = _this.props.selectRow.selected.slice();
      _this.store.setSelectedRowKey(copy);
    }
    var currPage = _Const2.default.PAGE_START_INDEX;
    if (typeof _this.props.options.page !== 'undefined') {
      currPage = _this.props.options.page;
    } else if (typeof _this.props.options.pageStartIndex !== 'undefined') {
      currPage = _this.props.options.pageStartIndex;
    }

    _this.state = {
      data: _this.getTableData(),
      currPage: currPage,
      sizePerPage: _this.props.options.sizePerPage || _Const2.default.SIZE_PER_PAGE_LIST[0],
      selectedRowKeys: _this.store.getSelectedRowKeys()
    };
    return _this;
  }

  _createClass(BootstrapTable, [{
    key: 'initTable',
    value: function initTable(props) {
      var _this2 = this;

      var keyField = props.keyField;


      var isKeyFieldDefined = typeof keyField === 'string' && keyField.length;
      _react2.default.Children.forEach(props.children, function (column) {
        if (column.props.isKey) {
          if (keyField) {
            throw 'Error. Multiple key column be detected in TableHeaderColumn.';
          }
          keyField = column.props.dataField;
        }
        if (column.props.filter) {
          // a column contains a filter
          if (!_this2.filter) {
            // first time create the filter on the BootstrapTable
            _this2.filter = new _Filter.Filter();
          }
          // pass the filter to column with filter
          column.props.filter.emitter = _this2.filter;
        }
      });

      this.colInfos = this.getColumnsDescription(props).reduce(function (prev, curr) {
        prev[curr.name] = curr;
        return prev;
      }, {});

      if (!isKeyFieldDefined && !keyField) {
        throw 'Error. No any key column defined in TableHeaderColumn.\n            Use \'isKey={true}\' to specify a unique column after version 0.5.4.';
      }

      this.store.setProps({
        isPagination: props.pagination,
        keyField: keyField,
        colInfos: this.colInfos,
        multiColumnSearch: props.multiColumnSearch,
        remote: this.isRemoteDataSource()
      });
    }
  }, {
    key: 'getTableData',
    value: function getTableData() {
      var result = [];
      var _props = this.props,
          options = _props.options,
          pagination = _props.pagination;

      var sortName = options.defaultSortName || options.sortName;
      var sortOrder = options.defaultSortOrder || options.sortOrder;
      var searchText = options.defaultSearch;
      if (sortName && sortOrder) {
        this.store.sort(sortOrder, sortName);
      }

      if (searchText) {
        this.store.search(searchText);
      }

      if (pagination) {
        var page = void 0;
        var sizePerPage = void 0;
        if (this.store.isChangedPage()) {
          sizePerPage = this.state.sizePerPage;
          page = this.state.currPage;
        } else {
          sizePerPage = options.sizePerPage || _Const2.default.SIZE_PER_PAGE_LIST[0];
          page = options.page || 1;
        }
        result = this.store.page(page, sizePerPage).get();
      } else {
        result = this.store.get();
      }
      return result;
    }
  }, {
    key: 'getColumnsDescription',
    value: function getColumnsDescription(_ref) {
      var children = _ref.children;

      return _react2.default.Children.map(children, function (column, i) {
        return {
          name: column.props.dataField,
          align: column.props.dataAlign,
          sort: column.props.dataSort,
          format: column.props.dataFormat,
          formatExtraData: column.props.formatExtraData,
          filterFormatted: column.props.filterFormatted,
          filterValue: column.props.filterValue,
          editable: column.props.editable,
          customEditor: column.props.customEditor,
          hidden: column.props.hidden,
          hiddenOnInsert: column.props.hiddenOnInsert,
          searchable: column.props.searchable,
          className: column.props.columnClassName,
          columnTitle: column.props.columnTitle,
          width: column.props.width,
          text: column.props.children,
          sortFunc: column.props.sortFunc,
          sortFuncExtraData: column.props.sortFuncExtraData,
          export: column.props.export,
          index: i
        };
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.initTable(nextProps);
      var options = nextProps.options,
          selectRow = nextProps.selectRow;


      this.store.setData(nextProps.data.slice());

      // from #481
      var page = this.state.currPage;
      if (this.props.options.page !== options.page) {
        page = options.page;
      }
      // from #481
      var sizePerPage = this.state.sizePerPage;
      if (this.props.options.sizePerPage !== options.sizePerPage) {
        sizePerPage = options.sizePerPage;
      }

      if (this.isRemoteDataSource()) {
        this.setState({
          data: nextProps.data.slice(),
          currPage: page,
          sizePerPage: sizePerPage
        });
      } else {
        // #125
        // remove !options.page for #709
        if (page > Math.ceil(nextProps.data.length / sizePerPage)) {
          page = 1;
        }
        var sortInfo = this.store.getSortInfo();
        var sortField = options.sortName || (sortInfo ? sortInfo.sortField : undefined);
        var sortOrder = options.sortOrder || (sortInfo ? sortInfo.order : undefined);
        if (sortField && sortOrder) this.store.sort(sortOrder, sortField);
        var data = this.store.page(page, sizePerPage).get();
        this.setState({
          data: data,
          currPage: page,
          sizePerPage: sizePerPage
        });
      }

      if (selectRow && selectRow.selected) {
        // set default select rows to store.
        var copy = selectRow.selected.slice();
        this.store.setSelectedRowKey(copy);
        this.setState({
          selectedRowKeys: copy
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._adjustTable();
      window.addEventListener('resize', this._adjustTable);
      this.refs.body.refs.container.addEventListener('scroll', this._scrollHeader);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._adjustTable);
      this.refs.body.refs.container.removeEventListener('scroll', this._scrollHeader);
      if (this.filter) {
        this.filter.removeAllListeners('onFilterChange');
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._adjustTable();
      this._attachCellEditFunc();
      if (this.props.options.afterTableComplete) {
        this.props.options.afterTableComplete();
      }
    }
  }, {
    key: '_attachCellEditFunc',
    value: function _attachCellEditFunc() {
      var cellEdit = this.props.cellEdit;

      if (cellEdit) {
        this.props.cellEdit.__onCompleteEdit__ = this.handleEditCell.bind(this);
        if (cellEdit.mode !== _Const2.default.CELL_EDIT_NONE) {
          this.props.selectRow.clickToSelect = false;
        }
      }
    }

    /**
     * Returns true if in the current configuration,
     * the datagrid should load its data remotely.
     *
     * @param  {Object}  [props] Optional. If not given, this.props will be used
     * @return {Boolean}
     */

  }, {
    key: 'isRemoteDataSource',
    value: function isRemoteDataSource(props) {
      return (props || this.props).remote;
    }
  }, {
    key: 'render',
    value: function render() {
      var style = {
        height: this.props.height,
        maxHeight: this.props.maxHeight
      };

      var columns = this.getColumnsDescription(this.props);
      var sortInfo = this.store.getSortInfo();
      var pagination = this.renderPagination();
      var toolBar = this.renderToolBar();
      var tableFilter = this.renderTableFilter(columns);
      var isSelectAll = this.isSelectAll();
      var hideSelectColumn = this.props.selectRow.hideSelectColumn ? this.props.selectRow.hideSelectColumn : false;
      var selectRow = _extends({}, this.props.selectRow, {
        clickToSelect: true,
        bgColor: '#fcf8da'
      });
      var sortIndicator = this.props.options.sortIndicator;
      if (typeof this.props.options.sortIndicator === 'undefined') sortIndicator = true;
      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)('react-bs-table-container', this.props.containerClass),
          style: this.props.containerStyle,
          'data-toggle': 'table' },
        toolBar,
        _react2.default.createElement(
          'div',
          { ref: 'table',
            className: (0, _classnames2.default)('react-bs-table', this.props.tableContainerClass),
            style: _extends({}, style, this.props.tableStyle),
            onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave },
          _react2.default.createElement(
            _TableHeader2.default,
            {
              ref: 'header',
              headerContainerClass: this.props.headerContainerClass,
              tableHeaderClass: this.props.tableHeaderClass,
              caption: this.props.caption,
              style: this.props.headerStyle,
              rowSelectType: this.props.selectRow.mode,
              customComponent: this.props.selectRow.customComponent,
              hideSelectColumn: hideSelectColumn,
              sortName: sortInfo ? sortInfo.sortField : undefined,
              sortOrder: sortInfo ? sortInfo.order : undefined,
              sortIndicator: sortIndicator,
              onSort: this.handleSort,
              onSelectAllRow: this.handleSelectAllRow,
              bordered: this.props.bordered,
              condensed: this.props.condensed,
              isFiltered: this.filter ? true : false,
              isSelectAll: isSelectAll },
            this.props.children
          ),
          _react2.default.createElement(_TableBody2.default, { ref: 'body',
            bodyContainerClass: this.props.bodyContainerClass,
            tableBodyClass: this.props.tableBodyClass,
            style: _extends({}, style, this.props.bodyStyle),
            data: this.state.data,
            columns: columns,
            trClassName: this.props.trClassName,
            striped: this.props.striped,
            bordered: this.props.bordered,
            hover: this.props.hover,
            keyField: this.store.getKeyField(),
            condensed: this.props.condensed,
            selectRow: selectRow,
            cellEdit: this.props.cellEdit,
            selectedRowKeys: this.state.selectedRowKeys,
            onRowClick: this.handleRowClick,
            onRowMouseOver: this.handleRowMouseOver,
            onRowMouseOut: this.handleRowMouseOut,
            onSelectRow: this.handleSelectRow,
            noDataText: this.props.options.noDataText })
        ),
        tableFilter,
        pagination
      );
    }
  }, {
    key: 'isSelectAll',
    value: function isSelectAll() {
      if (this.store.isEmpty()) return false;
      var unselectable = this.props.selectRow.unselectable;
      var defaultSelectRowKeys = this.store.getSelectedRowKeys();
      var allRowKeys = this.store.getAllRowkey();

      if (defaultSelectRowKeys.length === 0) return false;
      var match = 0;
      var noFound = 0;
      var unSelectableCnt = 0;
      defaultSelectRowKeys.forEach(function (selected) {
        if (allRowKeys.indexOf(selected) !== -1) match++;else noFound++;
        if (unselectable && unselectable.indexOf(selected) !== -1) unSelectableCnt++;
      });

      if (noFound === defaultSelectRowKeys.length) return false;
      if (match === allRowKeys.length) {
        return true;
      } else {
        if (unselectable && match <= unSelectableCnt && unSelectableCnt === unselectable.length) return false;else return 'indeterminate';
      }
      // return (match === allRowKeys.length) ? true : 'indeterminate';
    }
  }, {
    key: 'cleanSelected',
    value: function cleanSelected() {
      this.store.setSelectedRowKey([]);
      this.setState({
        selectedRowKeys: []
      });
    }
  }, {
    key: 'handleEditCell',
    value: function handleEditCell(newVal, rowIndex, colIndex) {
      var onCellEdit = this.props.options.onCellEdit;
      var _props$cellEdit = this.props.cellEdit,
          beforeSaveCell = _props$cellEdit.beforeSaveCell,
          afterSaveCell = _props$cellEdit.afterSaveCell;

      var fieldName = void 0;
      _react2.default.Children.forEach(this.props.children, function (column, i) {
        if (i === colIndex) {
          fieldName = column.props.dataField;
          return false;
        }
      });

      if (beforeSaveCell) {
        var isValid = beforeSaveCell(this.state.data[rowIndex], fieldName, newVal);
        if (!isValid && typeof isValid !== 'undefined') {
          this.setState({
            data: this.store.get()
          });
          return;
        }
      }

      if (onCellEdit) {
        newVal = onCellEdit(this.state.data[rowIndex], fieldName, newVal);
      }

      if (this.isRemoteDataSource()) {
        if (afterSaveCell) {
          afterSaveCell(this.state.data[rowIndex], fieldName, newVal);
        }
        return;
      }

      var result = this.store.edit(newVal, rowIndex, fieldName).get();
      this.setState({
        data: result
      });

      if (afterSaveCell) {
        afterSaveCell(this.state.data[rowIndex], fieldName, newVal);
      }
    }
  }, {
    key: 'handleAddRowAtBegin',
    value: function handleAddRowAtBegin(newObj) {
      try {
        this.store.addAtBegin(newObj);
      } catch (e) {
        return e;
      }
      this._handleAfterAddingRow(newObj);
    }
  }, {
    key: 'getSizePerPage',
    value: function getSizePerPage() {
      return this.state.sizePerPage;
    }
  }, {
    key: 'getCurrentPage',
    value: function getCurrentPage() {
      return this.state.currPage;
    }
  }, {
    key: 'getTableDataIgnorePaging',
    value: function getTableDataIgnorePaging() {
      return this.store.getCurrentDisplayData();
    }
  }, {
    key: 'deleteRow',
    value: function deleteRow(dropRowKeys) {
      var onDeleteRow = this.props.options.onDeleteRow;

      if (onDeleteRow) {
        onDeleteRow(dropRowKeys);
      }

      this.store.setSelectedRowKey([]); // clear selected row key

      if (this.isRemoteDataSource()) {
        if (this.props.options.afterDeleteRow) {
          this.props.options.afterDeleteRow(dropRowKeys);
        }
        return;
      }

      this.store.remove(dropRowKeys); // remove selected Row
      var result = void 0;
      if (this.props.pagination) {
        var sizePerPage = this.state.sizePerPage;

        var currLastPage = Math.ceil(this.store.getDataNum() / sizePerPage);
        var currPage = this.state.currPage;

        if (currPage > currLastPage) currPage = currLastPage;
        result = this.store.page(currPage, sizePerPage).get();
        this.setState({
          data: result,
          selectedRowKeys: this.store.getSelectedRowKeys(),
          currPage: currPage
        });
      } else {
        result = this.store.get();
        this.setState({
          data: result,
          selectedRowKeys: this.store.getSelectedRowKeys()
        });
      }
      if (this.props.options.afterDeleteRow) {
        this.props.options.afterDeleteRow(dropRowKeys);
      }
    }
  }, {
    key: 'renderPagination',
    value: function renderPagination() {
      if (this.props.pagination) {
        var dataSize = void 0;
        if (this.isRemoteDataSource()) {
          dataSize = this.props.fetchInfo.dataTotalSize;
        } else {
          dataSize = this.store.getDataNum();
        }
        var options = this.props.options;

        if (Math.ceil(dataSize / this.state.sizePerPage) <= 1 && this.props.ignoreSinglePage) return null;
        return _react2.default.createElement(
          'div',
          { className: 'react-bs-table-pagination table-pagination tm-pagination' },
          _react2.default.createElement(_PaginationList2.default, {
            ref: 'pagination',
            currPage: this.state.currPage,
            changePage: this.handlePaginationData,
            sizePerPage: this.state.sizePerPage,
            sizePerPageList: options.sizePerPageList || _Const2.default.SIZE_PER_PAGE_LIST,
            pageStartIndex: options.pageStartIndex,
            paginationShowsTotal: options.paginationShowsTotal,
            paginationSize: options.paginationSize || _Const2.default.PAGINATION_SIZE,
            remote: this.isRemoteDataSource(),
            dataSize: dataSize,
            onSizePerPageList: options.onSizePerPageList,
            prePage: options.prePage || _Const2.default.PRE_PAGE,
            nextPage: options.nextPage || _Const2.default.NEXT_PAGE,
            firstPage: options.firstPage || _Const2.default.FIRST_PAGE,
            lastPage: options.lastPage || _Const2.default.LAST_PAGE,
            hideSizePerPage: options.hideSizePerPage })
        );
      }
      return null;
    }
  }, {
    key: 'renderToolBar',
    value: function renderToolBar() {
      var _props2 = this.props,
          selectRow = _props2.selectRow,
          insertRow = _props2.insertRow,
          deleteRow = _props2.deleteRow,
          search = _props2.search,
          children = _props2.children;

      var enableShowOnlySelected = selectRow && selectRow.showOnlySelected;
      if (enableShowOnlySelected || insertRow || deleteRow || search || this.props.exportCSV) {
        var columns = void 0;
        if (Array.isArray(children)) {
          columns = children.map(function (column, r) {
            var props = column.props;

            return {
              name: props.children,
              field: props.dataField,
              hiddenOnInsert: props.hiddenOnInsert,
              // when you want same auto generate value and not allow edit, example ID field
              autoValue: props.autoValue || false,
              // for create editor, no params for column.editable() indicate that editor for new row
              editable: props.editable && typeof props.editable === 'function' ? props.editable() : props.editable,
              format: props.dataFormat ? function (value) {
                return props.dataFormat(value, null, props.formatExtraData, r).replace(/<.*?>/g, '');
              } : false
            };
          });
        } else {
          columns = [{
            name: children.props.children,
            field: children.props.dataField,
            editable: children.props.editable,
            hiddenOnInsert: children.props.hiddenOnInsert
          }];
        }
        return _react2.default.createElement(
          'div',
          { className: 'react-bs-table-tool-bar' },
          _react2.default.createElement(_ToolBar2.default, {
            defaultSearch: this.props.options.defaultSearch,
            clearSearch: this.props.options.clearSearch,
            searchDelayTime: this.props.options.searchDelayTime,
            enableInsert: insertRow,
            enableDelete: deleteRow,
            enableSearch: search,
            enableExportCSV: this.props.exportCSV,
            enableShowOnlySelected: enableShowOnlySelected,
            columns: columns,
            searchPlaceholder: this.props.searchPlaceholder,
            exportCSVText: this.props.options.exportCSVText,
            insertText: this.props.options.insertText,
            deleteText: this.props.options.deleteText,
            saveText: this.props.options.saveText,
            closeText: this.props.options.closeText,
            ignoreEditable: this.props.options.ignoreEditable,
            onAddRow: this.handleAddRow,
            onDropRow: this.handleDropRow,
            onSearch: this.handleSearch,
            onExportCSV: this.handleExportCSV,
            onShowOnlySelected: this.handleShowOnlySelected })
        );
      } else {
        return null;
      }
    }
  }, {
    key: 'renderTableFilter',
    value: function renderTableFilter(columns) {
      if (this.props.columnFilter) {
        return _react2.default.createElement(_TableFilter2.default, { columns: columns,
          rowSelectType: this.props.selectRow.mode,
          onFilter: this.handleFilterData });
      } else {
        return null;
      }
    }
  }, {
    key: '_handleAfterAddingRow',
    value: function _handleAfterAddingRow(newObj) {
      var result = void 0;
      if (this.props.pagination) {
        // if pagination is enabled and insert row be trigger, change to last page
        var sizePerPage = this.state.sizePerPage;

        var currLastPage = Math.ceil(this.store.getDataNum() / sizePerPage);
        result = this.store.page(currLastPage, sizePerPage).get();
        this.setState({
          data: result,
          currPage: currLastPage
        });
      } else {
        result = this.store.get();
        this.setState({
          data: result
        });
      }

      if (this.props.options.afterInsertRow) {
        this.props.options.afterInsertRow(newObj);
      }
    }
  }]);

  return BootstrapTable;
}(_react.Component);

BootstrapTable.propTypes = {
  keyField: _propTypes2.default.string,
  height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  maxHeight: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),
  caption: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.string]),
  remote: _propTypes2.default.bool, // remote data, default is false
  striped: _propTypes2.default.bool,
  bordered: _propTypes2.default.bool,
  hover: _propTypes2.default.bool,
  condensed: _propTypes2.default.bool,
  pagination: _propTypes2.default.bool,
  searchPlaceholder: _propTypes2.default.string,
  selectRow: _propTypes2.default.shape({
    mode: _propTypes2.default.oneOf([_Const2.default.ROW_SELECT_NONE, _Const2.default.ROW_SELECT_SINGLE, _Const2.default.ROW_SELECT_MULTI]),
    customComponent: _propTypes2.default.func,
    bgColor: _propTypes2.default.string,
    selected: _propTypes2.default.array,
    onSelect: _propTypes2.default.func,
    onSelectAll: _propTypes2.default.func,
    clickToSelect: _propTypes2.default.bool,
    hideSelectColumn: _propTypes2.default.bool,
    clickToSelectAndEditCell: _propTypes2.default.bool,
    showOnlySelected: _propTypes2.default.bool,
    unselectable: _propTypes2.default.array
  }),
  cellEdit: _propTypes2.default.shape({
    mode: _propTypes2.default.string,
    blurToSave: _propTypes2.default.bool,
    beforeSaveCell: _propTypes2.default.func,
    afterSaveCell: _propTypes2.default.func
  }),
  insertRow: _propTypes2.default.bool,
  deleteRow: _propTypes2.default.bool,
  search: _propTypes2.default.bool,
  columnFilter: _propTypes2.default.bool,
  trClassName: _propTypes2.default.any,
  tableStyle: _propTypes2.default.object,
  containerStyle: _propTypes2.default.object,
  headerStyle: _propTypes2.default.object,
  bodyStyle: _propTypes2.default.object,
  containerClass: _propTypes2.default.string,
  tableContainerClass: _propTypes2.default.string,
  headerContainerClass: _propTypes2.default.string,
  bodyContainerClass: _propTypes2.default.string,
  tableHeaderClass: _propTypes2.default.string,
  tableBodyClass: _propTypes2.default.string,
  options: _propTypes2.default.shape({
    clearSearch: _propTypes2.default.bool,
    sortName: _propTypes2.default.string,
    sortOrder: _propTypes2.default.string,
    defaultSortName: _propTypes2.default.string,
    defaultSortOrder: _propTypes2.default.string,
    sortIndicator: _propTypes2.default.bool,
    afterTableComplete: _propTypes2.default.func,
    afterDeleteRow: _propTypes2.default.func,
    afterInsertRow: _propTypes2.default.func,
    afterSearch: _propTypes2.default.func,
    afterColumnFilter: _propTypes2.default.func,
    onRowClick: _propTypes2.default.func,
    page: _propTypes2.default.number,
    pageStartIndex: _propTypes2.default.number,
    paginationShowsTotal: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.func]),
    sizePerPageList: _propTypes2.default.array,
    sizePerPage: _propTypes2.default.number,
    paginationSize: _propTypes2.default.number,
    hideSizePerPage: _propTypes2.default.bool,
    onSortChange: _propTypes2.default.func,
    onPageChange: _propTypes2.default.func,
    onSizePerPageList: _propTypes2.default.func,
    onFilterChange: _propTypes2.default.func,
    onSearchChange: _propTypes2.default.func,
    onAddRow: _propTypes2.default.func,
    onExportToCSV: _propTypes2.default.func,
    onCellEdit: _propTypes2.default.func,
    noDataText: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
    handleConfirmDeleteRow: _propTypes2.default.func,
    prePage: _propTypes2.default.string,
    nextPage: _propTypes2.default.string,
    firstPage: _propTypes2.default.string,
    lastPage: _propTypes2.default.string,
    searchDelayTime: _propTypes2.default.number,
    exportCSVText: _propTypes2.default.string,
    insertText: _propTypes2.default.string,
    deleteText: _propTypes2.default.string,
    saveText: _propTypes2.default.string,
    closeText: _propTypes2.default.string,
    ignoreEditable: _propTypes2.default.bool,
    defaultSearch: _propTypes2.default.string
  }),
  fetchInfo: _propTypes2.default.shape({
    dataTotalSize: _propTypes2.default.number
  }),
  exportCSV: _propTypes2.default.bool,
  csvFileName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  ignoreSinglePage: _propTypes2.default.bool
};
BootstrapTable.defaultProps = {
  height: '100%',
  maxHeight: undefined,
  striped: false,
  bordered: true,
  hover: false,
  condensed: false,
  pagination: false,
  searchPlaceholder: undefined,
  selectRow: {
    mode: _Const2.default.ROW_SELECT_MULTI,
    bgColor: '#fcf8da',
    selected: [],
    onSelect: undefined,
    onSelectAll: undefined,
    clickToSelect: true,
    hideSelectColumn: false,
    clickToSelectAndEditCell: false,
    showOnlySelected: false,
    unselectable: [],
    customComponent: undefined
  },
  cellEdit: {
    mode: _Const2.default.CELL_EDIT_NONE,
    blurToSave: false,
    beforeSaveCell: undefined,
    afterSaveCell: undefined
  },
  insertRow: false,
  deleteRow: false,
  search: false,
  multiColumnSearch: false,
  columnFilter: false,
  trClassName: '',
  tableStyle: undefined,
  containerStyle: undefined,
  headerStyle: undefined,
  bodyStyle: undefined,
  containerClass: null,
  tableContainerClass: null,
  headerContainerClass: null,
  bodyContainerClass: null,
  tableHeaderClass: null,
  tableBodyClass: null,
  options: {
    clearSearch: false,
    sortName: undefined,
    sortOrder: undefined,
    defaultSortName: undefined,
    defaultSortOrder: undefined,
    sortIndicator: true,
    afterTableComplete: undefined,
    afterDeleteRow: undefined,
    afterInsertRow: undefined,
    afterSearch: undefined,
    afterColumnFilter: undefined,
    onRowClick: undefined,
    onMouseLeave: undefined,
    onMouseEnter: undefined,
    onRowMouseOut: undefined,
    onRowMouseOver: undefined,
    page: undefined,
    paginationShowsTotal: false,
    sizePerPageList: _Const2.default.SIZE_PER_PAGE_LIST,
    sizePerPage: undefined,
    paginationSize: _Const2.default.PAGINATION_SIZE,
    hideSizePerPage: false,
    onSizePerPageList: undefined,
    noDataText: undefined,
    handleConfirmDeleteRow: undefined,
    prePage: _Const2.default.PRE_PAGE,
    nextPage: _Const2.default.NEXT_PAGE,
    firstPage: _Const2.default.FIRST_PAGE,
    lastPage: _Const2.default.LAST_PAGE,
    pageStartIndex: undefined,
    searchDelayTime: undefined,
    exportCSVText: _Const2.default.EXPORT_CSV_TEXT,
    insertText: _Const2.default.INSERT_BTN_TEXT,
    deleteText: _Const2.default.DELETE_BTN_TEXT,
    saveText: _Const2.default.SAVE_BTN_TEXT,
    closeText: _Const2.default.CLOSE_BTN_TEXT,
    ignoreEditable: false,
    defaultSearch: ''
  },
  fetchInfo: {
    dataTotalSize: 0
  },
  exportCSV: false,
  csvFileName: 'spreadsheet.csv',
  ignoreSinglePage: false
};

exports.default = BootstrapTable;