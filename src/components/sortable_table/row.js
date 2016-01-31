import React from 'react';
import Estimator from '../estimator';
import Status from '../status';
import Tags from '../tags';
import TagEditor from '../tag_editor';
import moment from 'moment';

/*
 * Renders a single table row for displaying item data.
 * Row accepts expanded prop for controlling whether the row appears
 * condensed (default) or optionally expanded (if using row with the sortable TableHeader.
 * Toggling between the two states happens via the Expander element in TableHeader.)
 * @TODO: reorg styles so don't have to calculate here.
 */

function abbreviateUsername(user) {
  return user.last_name ? user.first_name + ' ' + user.last_name[0] + '.' :
    user.first_name;
}

const TableRow = React.createClass({

  propTypes: {
    model: React.PropTypes.object.isRequired,
    columns: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    expanded: React.PropTypes.bool,
    baseUrl: React.PropTypes.string,
    modelChangerUtilities: React.PropTypes.object,
    navigatorUtility: React.PropTypes.object,
    isBulkEditable: React.PropTypes.bool,
    onBulkSelect: React.PropTypes.func
  },

  getCellBuilder(column, className, id) {
    let methodMap = {
      product: this.buildProductCell,
      number: this.buildNumberCell,
      size: this.buildEstimateCell,
      status: this.buildStatusCell,
      title: this.buildTitleCell,
      tags: this.buildTagsCell,
      'created by': this.buildCreatedByCell,
      'assigned to': this.buildAssigneeCell,
      created: this.buildCreatedAtCell
    };

    return methodMap[column](className, id);
  },

  render() {
    let p = this.props;
    let modelId = [p.model.product.id, p.model.number];

    let wrapperClass = 'wrapper ' + (p.expanded ? 'expanded' : 'condensed');
    let rowClass = 'sortable__row ' + p.model.type;

    if (p.expanded) {
      rowClass += ' expanded';
    }

    // "matched": item is grouped with parent/subitems.
    // "nonMatching": item doesn't fit collection filters, but is included to match w/subitems that do.
    if (p.model.isMatched) {
      rowClass += p.model.isNonMatching ? ' matched non-matching' : ' matched';
    }

    let cells = [];
    if (p.isBulkEditable) {
      cells.push(
        <td key={'control' + ':' + modelId} className='sortable__cell'>
          {this.buildControlCell(wrapperClass)}
        </td>
      );
    }

    p.columns.forEach((column) => {
      cells.push(
        <td key={column + ':' + modelId} className='sortable__cell'>
          {this.getCellBuilder(column, wrapperClass, modelId)}
        </td>
      );
    });

    return (
      <tr className={rowClass}>
        {cells}
      </tr>
    );
  },

  buildControlCell(classes) {
    // Left border on matched rows causes padding weirdness in checkboxes,
    // so we add corrective styles on matched rows.
    let p = this.props;
    classes += p.model.isMatched ? ' narrow matched' : ' narrow';
    return (
      <div className={classes}>
        <input type='checkbox' onClick={() => { return p.onBulkSelect(p.model); }} />
      </div>
    );
  },

  buildProductCell(classes) {
    let p = this.props;
    let linkProps = {
      href: p.baseUrl + '/product/' + p.model.product.id,
      className: 'js-item-link link product-cell',
    };

    let subitemClass = p.expanded ? 'subitem expanded' : 'subitem';
    let subitemArrow = p.model.parent ? <i className={subitemClass}></i> : '';

    return (
      <div className={classes + ' wider'}>
        {subitemArrow}
        <a {...linkProps}>{p.model.product.name}</a>
      </div>
    );
  },

  buildNumberCell(classes) {
    let p = this.props;
    let numberProps = {
      href: p.baseUrl + '/product/' + p.model.product.id + '/item/' + p.model.number,
      className: 'js-item-link link number-cell',
      'data-item-number': p.model.number
    };

    return (
      <div className={classes}>
        <a {...numberProps}>#{p.model.number}</a>
      </div>
    );
  },

  buildEstimateCell(classes, mId) {
    let p = this.props;
    let estimateProps = {
      modelId: mId,
      readOnly: !!p.model.isNonMatching,
      itemType: p.model.type,
      score: p.model.score,
      estimateChanger: p.modelChangerUtilities.estimateChanger
    };

    return (
      <div className={classes + ' narrow'}>
        <Estimator {...estimateProps} />
      </div>
    );
  },

  buildStatusCell(classes, mId) {
    let p = this.props;
    let statusProps = {
      modelId: mId,
      readOnly: !!p.model.isNonMatching,
      status: p.model.status,
      statusChanger: p.modelChangerUtilities.statusChanger
    };

    return (
      <div className={classes + ' narrow'}>
        <Status {...statusProps} />
      </div>
    );
  },

  buildCreatedByCell(classes) {
    return (
      <div className={classes}>
        {abbreviateUsername(this.props.model.created_by)}
      </div>
    );
  },

  buildAssigneeCell(classes, mId) {
    // @TODO
    return (<div></div>);
  },

  buildTitleCell(classes) {
    let p = this.props;
    let titleProps = {
      href: p.baseUrl + '/product/' + p.model.product.id + '/item/' + p.model.number,
      className: 'js-item-link link title-cell',
      'data-item-number': p.model.number
    };

    return (
      <div className={classes + ' widest'}>
        <a {...titleProps}>
          {p.model.title}
        </a>
      </div>
    );
  },

  buildTagsCell(classes, mId) {
    let p = this.props;
    let editorProps = {
      modelId: mId,
      readOnly: !!p.model.isNonMatching,
      tags: p.model.tags,
      tagChanger: p.modelChangerUtilities.tagChanger
    };

    let tagsProps = {
      tags: p.model.tags,
      condensed: !p.expanded,
      navigatorUtility: p.navigatorUtility
    };

    return (
      <div className={classes + ' wider'}>
        <TagEditor {...editorProps} />
        <Tags {...tagsProps} />
      </div>
    );
  },

  buildCreatedAtCell(classes) {
    return (
      <div className={classes + ' wide'}>
        {moment(this.props.model.created_at).format('MM/DD/YY')}
      </div>
    );
  }
});

export default TableRow;