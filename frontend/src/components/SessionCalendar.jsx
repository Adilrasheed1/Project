import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

export default function SessionCalendar() {
  const events = [
    { title: 'DSA Session', date: '2026-06-03', color: '#D85A30' },
    { title: 'Graphs & Trees', date: '2026-06-05', color: '#378ADD' },
  ]

  return (
    <div className="bg-gray-300 rounded-sm ml-2 mr-2 mt-2  overflow-hidden p-4 shadow-sm [&_.fc-button]:!bg-transparent [&_.fc-button]:!border [&_.fc-button]:!border-gray-200 [&_.fc-button]:!text-gray-600 [&_.fc-button]:!rounded-lg [&_.fc-button]:!text-xs [&_.fc-button]:!shadow-none [&_.fc-button:hover]:!bg-gray-50 [&_.fc-button-active]:!bg-orange-500 [&_.fc-button-active]:!border-orange-500 [&_.fc-button-active]:!text-white [&_.fc-button-primary:not(:disabled).fc-button-active]:!bg-orange-500 [&_.fc-button-primary:not(:disabled).fc-button-active]:!border-orange-500 [&_.fc-button-primary:not(:disabled).fc-button-active]:!text-white [&_.fc-toolbar-title]:!text-base [&_.fc-toolbar-title]:!font-medium [&_.fc-toolbar-title]:!text-gray-800 [&_.fc-col-header-cell]:!text-xs [&_.fc-col-header-cell]:!font-medium [&_.fc-col-header-cell]:!text-gray-400 [&_.fc-col-header-cell]:!uppercase [&_.fc-col-header-cell]:!tracking-wide [&_.fc-col-header-cell]:!py-2 [&_.fc-col-header-cell]:!border-0 [&_td]:!border-gray-100 [&_th]:!border-gray-100 [&_.fc-daygrid-day-number]:!text-xs [&_.fc-daygrid-day-number]:!text-gray-500 [&_.fc-daygrid-day-number]:!p-2 [&_.fc-day-today]:!bg-orange-50 [&_.fc-day-today_.fc-daygrid-day-number]:!bg-orange-500 [&_.fc-day-today_.fc-daygrid-day-number]:!text-white [&_.fc-day-today_.fc-daygrid-day-number]:!rounded-full [&_.fc-day-today_.fc-daygrid-day-number]:!w-6 [&_.fc-day-today_.fc-daygrid-day-number]:!h-6 [&_.fc-day-today_.fc-daygrid-day-number]:!flex [&_.fc-day-today_.fc-daygrid-day-number]:!items-center [&_.fc-day-today_.fc-daygrid-day-number]:!justify-center [&_.fc-daygrid-event]:!rounded-md [&_.fc-daygrid-event]:!border-0 [&_.fc-daygrid-event]:!text-xs [&_.fc-daygrid-event]:!font-medium [&_.fc-daygrid-event]:!px-1.5 [&_.fc-event-title]:!truncate">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        height="50vh"
        eventDidMount={(info) => {
          info.el.title = info.event.title
        }}
      />
    </div>
  )
}