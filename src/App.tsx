import {FC,useState} from 'react'
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import addHours from 'date-fns/addHours'
import startOfHour from 'date-fns/startOfHour'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {TextField, Modal, Button, Box, DialogTitle, Typography} from "@mui/material";
import {CloseOutlined} from "@mui/icons-material";

const App: FC = () => {
  const [title, setTitle] = useState<string>()
  const [edit, setEdit] = useState<boolean>()

  const [data, setData] = useState({
    start:start,
    end:end
  })

  const [openModal, setOpenModal] = useState<boolean>(false)

  const [events, setEvents] = useState<Event[]>([
    {
      title: 'Uygulama 3 gün içerisinde hazır olmalı',
      start,
      end,
    }
  ])

  function handleSelectSlot(data:any) {
    const {start,end} = data
    setOpenModal(true)
    setData({
      start:start,
      end:end
    })
  }
  const handleClose =()=>{
   setOpenModal(false)
   setEdit(false)
   setTitle("")
  }
  const handleEventResize: withDragAndDropProps['onEventResize'] = data => {
    const { start, end,event } = data
    let index =events.findIndex(e=>e.start === event.start)
    setEvents(currentEvents => {
      currentEvents[index].start = new Date(start)
      currentEvents[index].end = new Date(end)
      return currentEvents
    })
  }

  const handleEventDrop: withDragAndDropProps['onEventDrop'] = data => {
    const { start ,end,event  } = data
    let index =events.findIndex(e=>e.start === event.start)
    setEvents(currentEvents => {
      currentEvents[index].start = new Date(start)
      currentEvents[index].end = new Date(end)
      return currentEvents
    })
  }
  const handleSelectEvent:(event: any) => void = (event:any) => {
    const { start ,end,title  } = event
    setData({
      start:start,
      end:end,
    })
    setTitle(title)
    setEdit(true)
    setOpenModal(true)
  }
  const handleSave=()=>{
    if(edit){
      let index =events.findIndex(e=>{
        return e.start === data.start
      })
      setEvents(currentEvents => {
        currentEvents[index].title = title
        return currentEvents
      })
    }else{
      let newEvent = {} as Event;
      newEvent.start =  new Date(data.start) ;
      newEvent.end = new Date(data.end);
      newEvent.title = title;
      setEvents((prevState => [...prevState,newEvent]))
    }

    handleClose()
  }
  const handleDelete=()=>{
    setEvents(currentEvents => {
      return currentEvents.filter(current=> current.start !== data.start)
    })
    handleClose()
  }
  return (
     <div>
       <Modal open={openModal} onClose={handleClose}>
           <Box sx={{
             position: 'absolute',
             top: '50%',
             left: '50%',
             transform: 'translate(-50%, -50%)',
             width: 400,
             bgcolor: 'background.paper',
             boxShadow: 24,
             p: 4,
           }}>
             <Box style={{display:"flex",justifyContent:"flex-end"}}>
               <Button disableRipple={true} color={"inherit"} onClick={handleClose} >
                 <CloseOutlined/>
               </Button>
             </Box>
             <Typography variant={"h5"} paddingBottom={1}>Create Title</Typography>
             <TextField fullWidth placeholder={"Write Title"} value={title} onChange={(e)=>setTitle(e.target.value)} />
             <Box  style={{display:"flex",flexDirection:"row",justifyContent:"space-between",paddingTop:10 }}>
               <Button onClick={handleDelete} variant={"outlined"} color={"error"}  >{"Sil"}</Button>
               <Button onClick={handleSave} variant={"outlined"} color={"primary"}  >{edit ? "Save" : "Create"}</Button>
             </Box>
           </Box>
       </Modal>
       <DnDCalendar
           selectable
           views ={["month","week","day"]}
           defaultView='month'
           events={events}
           localizer={localizer}
           onEventDrop={handleEventDrop}
           onEventResize={handleEventResize}
           onSelectSlot={handleSelectSlot}
           onSelectEvent={handleSelectEvent}
           resizable
           style={{ height: '100vh' }}
       />
     </div>
  )
}

const locales = {
  'en-US': enUS,
}
const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1)
const now = new Date()
const start = endOfHour(now)
const end = addHours(start, 2)
// The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
//@ts-ignore
const DnDCalendar = withDragAndDrop(Calendar)

export default App