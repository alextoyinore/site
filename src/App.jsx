import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import GalleryDetail from './pages/GalleryDetail';
import EventDetail from './pages/EventDetail';
import EventRegister from './pages/EventRegister';
import Team from './pages/Team';
import Partners from './pages/Partners';
import Sponsors from './pages/Sponsors';
import Join from './pages/Join';
import Contact from './pages/Contact';

import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import DashboardEvents from './pages/DashboardEvents';
import DashboardVolunteers from './pages/DashboardVolunteers';
import DashboardSponsors from './pages/DashboardSponsors';
import DashboardDonations from './pages/DashboardDonations';
import DashboardSettings from './pages/DashboardSettings';
import DashboardGallery from './pages/DashboardGallery';
import DashboardReport from './pages/DashboardReport';
import DashboardEventForm from './pages/DashboardEventForm';
import DashboardBlogs from './pages/DashboardBlogs';
import DashboardBlogForm from './pages/DashboardBlogForm';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/events" element={<DashboardEvents />} />
                <Route path="/events/new" element={<DashboardEventForm />} />
                <Route path="/events/edit/:id" element={<DashboardEventForm />} />
                <Route path="/blogs" element={<DashboardBlogs />} />
                <Route path="/blogs/new" element={<DashboardBlogForm />} />
                <Route path="/blogs/edit/:id" element={<DashboardBlogForm />} />
                <Route path="/gallery" element={<DashboardGallery />} />
                <Route path="/reports" element={<DashboardReport />} />
                <Route path="/volunteers" element={<DashboardVolunteers />} />
                <Route path="/sponsors" element={<DashboardSponsors />} />
                <Route path="/donations" element={<DashboardDonations />} />
                <Route path="/settings" element={<DashboardSettings />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Public Site Routes */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/:id/register" element={<EventRegister />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/:id" element={<GalleryDetail />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/join" element={<Join />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
