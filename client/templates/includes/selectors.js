Template.numberSelector.helpers({
  values: function() {
    var result = [];
    for (var i = this.from; i <= this.to; i++) {
      result.push({
        text: i.toString(),
        value: i
      });
    }
    return result;
  },
  selectedString: function(value) {
    var template = Template.instance();
    return value == template.data.value ? "selected" : "";
  },
});

Template.monthSelector.helpers({
  values: function() {
    var names = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    var result = [];

    for (var i = 0; i < names.length; i++) {
      result.push({
        text: names[i],
        value: i
      });
    }
    return result;
  },
  selectedString: function(value) {
    var template = Template.instance();
    return value == template.data.value ? "selected" : "";
  },
});

Template.dateSelector.helpers({
  widgetData: function() {
    var data = {
      name: this.name,
      dataName: this.dataName,
      date: this.value,
      selectedYear: this.value ? this.value.getFullYear() : null,
      selectedMonth: this.value ? this.value.getMonth() : null,
      selectedDay: this.value ? this.value.getDate() : null,
      from: this.from || 1950,
      to: this.to || (new Date()).getFullYear()
    };
    return data;
  },
  dateString: function() {
    var validDate = this.date instanceof Date && isFinite(this.date);
    var value = validDate ? this.date.toISOString() : "";
    return value;
  },
  yearInputName: function() {
    return this.name + "_year";
  },
  monthInputName: function() {
    return this.name + "_month";
  },
  dayInputName: function() {
    return this.name + "_day";
  }
});

Template.dateSelector.events({
  'change select': function(e) {
    var template = Template.instance();

    var $elem = $(e.target);
    var name = $elem.data("name");

    var endswith = function(s, sufix) {
      return s.indexOf(sufix) == s.length - sufix.length;
    };

    var year = parseFloat($(template.find("select[data-name$='_year']")).val());
    var month = parseFloat($(template.find("select[data-name$='_month']")).val());
    var maxDay = 31;    
    if (month == 1 && year % 4 == 0) {
      maxDay = 29;      
    } else if (month == 1) {
      maxDay = 28;
    } else if ((month + 1) % 2 == 1) {
      maxDay = 30
    }

    var day = parseFloat($(template.find("select[data-name$='_day']")).val());
    if (day > maxDay) {
      $(template.find("select[data-name$='_day']")).val(maxDay);
    }

    var d = new Date();
    d.setYear(year);
    d.setMonth(month);    
    d.setDate(day);
    d.setHours(12);
    d.setSeconds(0);
    d.setMinutes(0);
    d.setMilliseconds(0);

    var validDate = d instanceof Date && isFinite(d);    
    var value = validDate ? d.toISOString() : "";
    $(template.find('input')).val(value);
  }
});


Template.generalSelector.helpers({
  selectedString: function(value) {
    var template = Template.instance();
    return value == template.data.value ? "selected" : "";
  }
});
