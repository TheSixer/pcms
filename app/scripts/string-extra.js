'use strict';

String.prototype.equals = function (val) {
  var isEquals = false;

  if (this === val || this + '' === val + '') {
    isEquals = true;
  }

  // console.log('val1:', this);
  // console.log('val2:', val);
  // console.log('isEquals:', isEquals);

  return isEquals;
};

String.prototype.notEquals = function (val) {
  var isNotEquals = false;

  if (this + '' !== val + '') {
    isNotEquals = true;
  }

  return isNotEquals;
};
