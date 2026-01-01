import { useState } from 'react';
import { Save, FileText } from 'lucide-react';
import styles from './DashboardPages.module.css';
import eventsData from '../data/events.json';
import Editor from '../components/Editor';

const DashboardReport = () => {
    const [selectedEvent, setSelectedEvent] = useState('');
    const [reportContent, setReportContent] = useState({ blocks: [] });

    const handleSave = () => {
        if (!selectedEvent) return alert('Please select an event');
        if (!reportContent.blocks || reportContent.blocks.length === 0) return alert('Report content cannot be empty');

        console.log('Saving report for event', selectedEvent, reportContent);
        alert('Report Saved Successfully!');
        setReportContent({ blocks: [] });
        setSelectedEvent('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Event Reporting</h1>
                <button className={styles.actionBtn} onClick={handleSave}>
                    <Save size={18} /> Save Report
                </button>
            </div>

            <div style={{ display: 'grid', gap: '2rem', height: 'calc(100vh - 200px)' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', height: 'fit-content' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Event to Report On</label>
                    <select
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                    >
                        <option value="">-- Choose an Event --</option>
                        {eventsData.map(event => (
                            <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                    </select>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        <FileText size={20} color="hsl(var(--primary))" />
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Report Editor</h3>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <Editor
                            data={reportContent}
                            onChange={(data) => setReportContent(data)}
                            placeholder="Start writing your event report here..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardReport;
