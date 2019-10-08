import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-jalaali';
import 'moment/locale/fa';
import { momentLocalizer } from './index'
import Calendar from './Calendar';

moment.locale('fa');
moment.loadPersian({ usePersianDigits: true });

const localizer = momentLocalizer(moment);

// https://github.com/intljusticemission/react-big-calendar/blob/master/src/Calendar.js#L564
const formats = {
  dateFormat: 'jD',
  // weekdayFormat: 'jD',
  monthHeaderFormat: 'jYYYY jMMMM',
  agendaDateFormat: 'jYYYY-jMM-jDD',
  dayHeaderFormat: 'dddd jDD jMMMM',
  dayRangeHeaderFormat: function({ start, end }, lang, localizer) {
    const preparedStart = moment(start).format(formats.dayHeaderFormat);
    const preparedEnd = moment(end).format(formats.dayHeaderFormat);

    return preparedStart + ' - ' + preparedEnd;
  },
};

const messages = {
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
};

class PersianCalendar extends PureComponent {
  state = {
    view: 'month',
    viewDate: null,
  };

  componentDidMount() {
    this.onRangeChange({
      start: moment()
        .startOf('month')
        .add(-5, 'days'),
      end: moment()
        .endOf('month')
        .add(5, 'days'),
    });
  }

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

  render() {
    const { onSelectEvent, events, getEventProps, onSelectSlot, ...rest } = this.props;
    const { view, viewDate } = this.state;

    return (
      <Calendar
        {...rest}
        rtl
        selectable
        style={{ height: 800 }}
        views={['month', 'day']}
        view={view}
        date={viewDate}
        formats={formats}
        culture="fa"
        localizer={localizer}
        messages={messages}
        startAccessor="start"
        endAccessor="end"
        events={events}
        onView={this.onView}
        onNavigate={this.onNavigate}
        onRangeChange={this.onRangeChange}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        eventPropGetter={getEventProps}
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
  onSelectSlot: function({ slots, start, end }) {
    this.setState({
      view: 'day',
      viewDate: start,
    });
  }
};

export default PersianCalendar;
