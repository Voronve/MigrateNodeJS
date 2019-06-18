exports.dateCondition = (dateStart, dateFinish) => {
  let condition = {};
  console.log('zeroDate', new Date(0));
  if (!dateStart && !dateFinish) {
    condition.$gte = new Date(0);
    return condition;
  }

  if (dateStart) {
    condition.$gte = new Date(dateStart);
  }
  if (dateFinish) {
    condition.$lt = new Date(dateFinish);
  }
  console.log('condition', condition);
  return condition;
};

exports.dateConditionOld = (dateStart, dateFinish) => {
  if (!dateStart && !dateFinish) {
    return {};
  }

  let condition = {};
  if (dateStart) {
    condition['$gte'] = dateStart;
  }
  if (dateFinish) {
    condition['$lt'] = dateFinish;
  }
  return { TimeStart: condition };
};
