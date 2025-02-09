import React, { useState } from 'react'
import TabProjectType from './TabProjectType'
import TabProjectDetails from './TabProjectDetails';
import TabProjectSettings from './TabProjectSettings';
import TabProjectBudget from './TabProjectBudget';
import TabProjectAssigned from './TabProjectAssigned';
import TabProjectTarget from './TabProjectTarget';
import TabAttachement from './TabAttachement';
import TabCompleted from './TabCompleted';

const steps = [
    { name: "Type", required: true },
    { name: "Details", required: false },
    { name: "Settings", required: false },
    { name: "Budget", required: true },
    { name: "Assagined", required: false },
    { name: "Target", required: false },
    { name: "Attachment", required: false },
    { name: "Completed", required: false },
];

const ProjectCreateContent = () => {
    const { user, nonProfitData, loading } = useAuth();
    const [timeframe, setTimeframe] = useState('month');
    const [stats, setStats] = useState({
        totalVolunteers: 0,
        hoursContributed: 0,
        peopleServed: 0,
        upcomingEvents: 0
    });

    const fetchStats = useCallback(async () => {
        try {
            // Get total volunteers (count of unique volunteers in event_volunteers)
            const { data: volunteersData } = await supabase
                .from('event_volunteers')
                .select('user_id', { count: 'exact', head: true })
                .eq('non_profit_id', nonProfitData.id);

            // Get upcoming events count
            const { data: eventsData } = await supabase
                .from('events')
                .select('id', { count: 'exact' })
                .eq('non_profit_id', nonProfitData.id)
                .gte('start_time', new Date().toISOString());

            setStats({
                totalVolunteers: volunteersData?.count || 0,
                hoursContributed: 0,
                peopleServed: 0,
                upcomingEvents: eventsData?.count || 0
            });

        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, [nonProfitData]);

    return (
        <div className="col-lg-12">
            <div className="card border-top-0">
                <div className="card-body p-0 wizard" id="project-create-steps">
                    <div className='steps clearfix'>
                        <ul role="tablist">
                            {steps.map((step, index) => (
                                <li
                                    key={index}
                                    className={`${currentStep === index ? "current" : ""} ${currentStep === index && error ? "error" : ""}`}
                                    onClick={(e) => handleTabClick(e, index)}
                                >
                                    <a href="#" className='d-block fw-bold'>{step.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="content clearfix">
                        {currentStep === 0 &&
                            <TabProjectType setFormData={setFormData} formData={formData} error={error}
                                            setError={setError}/>}
                        {currentStep === 1 && <TabProjectDetails/>}
                        {currentStep === 2 && <TabProjectSettings/>}
                        {currentStep === 3 &&
                            <TabProjectBudget setFormData={setFormData} formData={formData} error={error}
                                              setError={setError}/>}
                        {currentStep === 4 && <TabProjectAssigned/>}
                        {currentStep === 5 && <TabProjectTarget/>}
                        {currentStep === 6 && <TabAttachement/>}
                        {currentStep === 7 && <TabCompleted/>}
                    </div>

                    {/* Buttons */}
                    <div className="actions clearfix">
                        <ul>
                            <li className={`${currentStep === 0 ? "disabled" : ""}`} onClick={(e) => handlePrev(e)}
                                disabled={currentStep === 0}>
                                <a href="#">Previous</a>
                            </li>
                            <li className={`${currentStep === steps.length - 1 ? "disabled" : ""}`}
                                onClick={(e) => handleNext(e)} disabled={currentStep === steps.length - 1}>
                                <a href="#">Next</a>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default ProjectCreateContent