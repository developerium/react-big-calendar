import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-jalaali';
import 'moment/locale/fa';
import { momentLocalizer } from './index'
import Calendar from './Calendar';

// moment.locale('fa');
// moment.loadPersian({ usePersianDigits: true });

const localizer = momentLocalizer(moment);

class PersianCalendar extends PureComponent {
  state = {
    view: 'month',
    viewDate: null,
  };

  onView = view => {
    this.setState({ view });
  };

  onRangeChange = params => {
    const { onRangeChange } = this.props;
    let start, end;
    if (Array.isArray(params)) {
      start = params[0];
      end = params[1] ? params[1] : params[0]; // in day mode, end will be undefined
    } else {
      start = params.start;
      end = params.end;
    }

    // console.log('onRangeChange', start, end);
    const startObj = moment(start).add(-1, 'days');
    const endObj = moment(end).add(1, 'days');

    const preparedStart = startObj.year() + '-' + (startObj.month() + 1) + '-' + startObj.date();
    const preparedEnd = endObj.year() + '-' + (endObj.month() + 1) + '-' + endObj.date();

    onRangeChange({ start: preparedStart, end: preparedEnd });
  };

  onNavigate = (date, type) => {
    this.setState({ viewDate: date });
  };

  onSelectSlot = ({ slots, start, end }) => {
    this.setState({
      view: 'day',
      viewDate: start,
    });
  };

  render() {
    const { view, viewDate } = this.state;

    return (
      <Calendar
        rtl
        selectable
        views={['month', 'day']}
        culture="fa"
        startAccessor="start"
        endAccessor="end"
        onView={this.onView}
        onNavigate={this.onNavigate}
        onRangeChange={this.onRangeChange}
        onSelectSlot={this.onSelectSlot}
        {...this.props}
        view={view}
        date={viewDate}
        localizer={localizer}
      />
    );
  }
}

PersianCalendar.propTypes = {
  onSelectEvent: PropTypes.func,
  onRangeChange: PropTypes.func,
  getEventProps: PropTypes.func,
  onSelectSlot: PropTypes.func,
  events: PropTypes.array,
  formats: PropTypes.object,
  messages: PropTypes.object,
  style: PropTypes.object,
};

PersianCalendar.defaultProps = {
  events: [],
  onSelectEvent: () => {},
  onRangeChange: () => {},
  getEventProps: (event, start, end, isSelected) => {
    if (!event || !event.calendar_color) {
      return {};
    }

    return {
      style: {
        backgroundColor: event.calendar_color,
      },
    };
  },
  formats: {
    dateFormat: 'jD',
    // weekdayFormat: 'jD',
    monthHeaderFormat: 'jYYYY jMMMM',
    agendaDateFormat: 'jYYYY-jMM-jDD',
    dayHeaderFormat: 'dddd jDD jMMMM',
    dayRangeHeaderFormat: function({ start, end }, lang, localizer) {
      const preparedStart = moment(start).format(this.dayHeaderFormat);
      const preparedEnd = moment(end).format(this.dayHeaderFormat);

      return preparedStart + ' - ' + preparedEnd;
    },
  },
  messages: {
    allDay: 'تمام روز',
    previous: 'قبلی',
    next: 'بعدی',
    today: 'امروز',
    month: 'ماه',
    week: 'هفته',
    day: 'روز',
    date: 'تاریخ',
    time: 'ساعت',
    event: 'اتفاق',
    noEventsInRange: 'هیچ موردی در این بازه یافت نشد',
    showMore: function() {
      return 'نمایش بیشتر';
    },
  },
  style: { height: 800 },
};

export default PersianCalendar;
