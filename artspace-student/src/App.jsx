import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import NewBooking from './pages/NewBooking';
import MyBookings from './pages/MyBookings';
import Events from './pages/Events';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
export default function App(){return <Routes><Route element={<MainLayout/>}><Route path="/" element={<Dashboard/>}/><Route path="/calendar" element={<Calendar/>}/><Route path="/book" element={<NewBooking/>}/><Route path="/bookings" element={<MyBookings/>}/><Route path="/events" element={<Events/>}/><Route path="/notifications" element={<Notifications/>}/><Route path="/profile" element={<Profile/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
