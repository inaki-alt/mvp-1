import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/root";
import Home from "../pages/home";
import Analytics from "../pages/analytics";
import ReportsSales from "../pages/reports-sales";
import ReportsLeads from "../pages/reports-leads";
import ReportsProject from "../pages/reports-project";
import AppsChat from "../pages/apps-chat";
import LayoutApplications from "../layout/layoutApplications";
import AppsEmail from "../pages/apps-email";
import ReportsTimesheets from "../pages/reports-timesheets";
import LoginCover from "../pages/login-cover";
import AppsTasks from "../pages/apps-tasks";
import AppsNotes from "../pages/apps-notes";
import AppsCalender from "../pages/apps-calender";
import AppsStorage from "../pages/apps-storage";
import Proposalist from "../pages/proposal-list";
import CustomersList from "../pages/customers-list";
import ProposalView from "../pages/proposal-view";
import ProposalEdit from "../pages/proposal-edit";
import VolunteersList from "../pages/VolunteersList.jsx";
import CustomersView from "../pages/customers-view";
import CustomersCreate from "../pages/customers-create";
import ProposalCreate from "../pages/proposal-create";
import LeadsView from "../pages/leads-view";
import LeadsCreate from "../pages/leads-create";
import PaymentList from "../pages/payment-list";
import PaymentView from "../pages/payment-view/";
import PaymentCreate from "../pages/payment-create";
import ProjectsList from "../pages/projects-list";
import ProjectsView from "../pages/projects-view";
import ProjectsCreate from "../pages/projects-create";
import SettingsGaneral from "../pages/settings-ganeral";
import LayoutSetting from "../layout/layoutSetting";
import SettingsSeo from "../pages/settings-seo";
import SettingsTags from "../pages/settings-tags";
import SettingsEmail from "../pages/settings-email";
import SettingsTasks from "../pages/settings-tasks";
import SettingsLeads from "../pages/settings-leads";
import SettingsMiscellaneous from "../pages/settings-miscellaneous";
import SettingsRecaptcha from "../pages/settings-recaptcha";
import SettingsLocalization from "../pages/settings-localization";
import SettingsCustomers from "../pages/settings-customers";
import SettingsGateways from "../pages/settings-gateways";
import SettingsFinance from "../pages/settings-finance";
import SettingsSupport from "../pages/settings-support";
import LayoutAuth from "../layout/layoutAuth";
import LoginMinimal from "../pages/login-minimal";
import LoginCreative from "../pages/login-creative";
import RegisterCover from "../pages/register-cover";
import RegisterMinimal from "../pages/register-minimal";
import RegisterCreative from "../pages/register-creative";
import ResetCover from "../pages/reset-cover";
import ResetMinimal from "../pages/reset-minimal";
import ResetCreative from "../pages/reset-creative";
import ErrorCover from "../pages/error-cover";
import ErrorCreative from "../pages/error-creative";
import ErrorMinimal from "../pages/error-minimal";
import OtpCover from "../pages/otp-cover";
import OtpMinimal from "../pages/otp-minimal";
import OtpCreative from "../pages/otp-creative";
import MaintenanceCover from "../pages/maintenance-cover";
import MaintenanceMinimal from "../pages/maintenance-minimal";
import MaintenanceCreative from "../pages/maintenance-creative";
import HelpKnowledgebase from "../pages/help-knowledgebase";
import WidgetsLists from "../pages/widgets-lists";
import WidgetsTables from "../pages/widgets-tables";
import WidgetsCharts from "../pages/widgets-charts";
import WidgetsStatistics from "../pages/widgets-statistics";
import WidgetsMiscellaneous from "../pages/widgets-miscellaneous";
import EventsView from "@/components/calender/EventsView.jsx";
import React from "react";
import MessagesView from "@/components/Messages/MessagesView.jsx";
import VolunteerHome from "../pages/VolunteerHome";
import EventsManagement from "../components/volunteer/EventsManagement";
import VolunteerMessages from "../components/volunteer/VolunteerMessages";
import RewardsMarketplace from "../components/volunteer/RewardsMarketplace";
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '../pages/dashboard';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />

            },
            {
                path: "/home",
                element: <Home />

            },

        ]
    },
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/home",
                element:
                    <Home />
            },
            {
                path: "/volunteer/home",
                element: <VolunteerHome />
            },
            {
                path: "/volunteer/events",
                element: <EventsManagement />
            },
            {
                path: "/dashboard",
                element: <Home />
            },
            {
                path: "/messages",
                element: <MessagesView />,
            },
            {
                path: "/reports/sales",
                element: <ReportsSales />
            },
            {
                path: "/reports/leads",
                element: <ReportsLeads />
            },
            {
                path: "/reports/project",
                element: <ReportsProject />
            },
            {
                path: "/reports/timesheets",
                element: <ReportsTimesheets />
            },
            {
                path: "/proposal/list",
                element: <Proposalist />
            },
            {
                path: "/proposal/view",
                element: <ProposalView />
            },
            {
                path: "/proposal/edit",
                element: <ProposalEdit />
            },
            {
                path: "/proposal/create",
                element: <ProposalCreate />
            },
            {
                path: "/payment/list",
                element: <PaymentList />
            },
            {
                path: "/payment/view",
                element: <PaymentView />
            },
            {
                path: "/payment/create",
                element: <PaymentCreate />
            },
            {
                path: "/customers/list",
                element: <CustomersList />
            },
            {
                path: "/customers/view",
                element: <CustomersView />
            },
            {
                path: "/customers/create",
                element: <CustomersCreate />
            },
            {
                path: "/volunteers",
                element: <VolunteersList />
            },
            {
                path: "/leads/view",
                element: <LeadsView />
            },
            {
                path: "/leads/create",
                element: <LeadsCreate />
            },
            {
                path: "/events",
                element: <EventsView />
            },
            {
                path: "/projects/view",
                element: <ProjectsView />
            },
            {
                path: "/events/create",
                element: <ProjectsCreate />
            },
            {
                path: "/widgets/lists",
                element: <WidgetsLists />
            },
            {
                path: "/widgets/tables",
                element: <WidgetsTables />
            },
            {
                path: "/widgets/charts",
                element: <WidgetsCharts/>
            },
            {
                path: "/widgets/statistics",
                element: <WidgetsStatistics/>
            },
            {
                path: "/widgets/miscellaneous",
                element: <WidgetsMiscellaneous/>
            },
            {
                path: "/help/knowledgebase",
                element: <HelpKnowledgebase />
            },
            {
                path: "/volunteer/rewards",
                element: <RewardsMarketplace />
            },
        ]
    },
    {
        path: "/",
        element: <LayoutApplications />,
        children: [
            {
                path: "/events/list1",
                element: <EventsView />
            },
            {
                path: "/events/calendar",
                element: <AppsCalender />

            },
            {
                path: "/dashboard",
                element: <Home />
            },
            {
                path: "/dashboards/analytics",
                element: <Analytics />
            },
            {
                path: "/reports/sales",
                element: <ReportsSales />
            },
            {
                path: "/reports/leads",
                element: <ReportsLeads />
            },
            {
                path: "/reports/project",
                element: <ReportsProject />
            },
            {
                path: "/reports/timesheets",
                element: <ReportsTimesheets />
            },
            {
                path: "/proposal/list",
                element: <Proposalist />
            },
            {
                path: "/proposal/view",
                element: <ProposalView />
            },
            {
                path: "/proposal/edit",
                element: <ProposalEdit />
            },
            {
                path: "/proposal/create",
                element: <ProposalCreate />
            },
            {
                path: "/payment/list",
                element: <PaymentList />
            },
            {
                path: "/payment/view",
                element: <PaymentView />
            },
            {
                path: "/payment/create",
                element: <PaymentCreate />
            },
            {
                path: "/customers/list",
                element: <CustomersList />
            },
            {
                path: "/customers/view",
                element: <CustomersView />
            },
            {
                path: "/customers/create",
                element: <CustomersCreate />
            },
            {
                path: "/volunteers/list",
                element: <VolunteersList />
            },
            {
                path: "/leads/view",
                element: <LeadsView />
            },
            {
                path: "/leads/create",
                element: <LeadsCreate />
            },
            {
                path: "/events/list",
                element: <ProjectsList />
            },
            {
                path: "/projects/view",
                element: <ProjectsView />
            },
            {
                path: "/events/create",
                element: <ProjectsCreate />
            },
            {
                path: "/widgets/lists",
                element: <WidgetsLists />
            },
            {
                path: "/widgets/tables",
                element: <WidgetsTables />
            },
            {
                path: "/widgets/charts",
                element: <WidgetsCharts/>
            },
            {
                path: "/widgets/statistics",
                element: <WidgetsStatistics/>
            },
            {
                path: "/widgets/miscellaneous",
                element: <WidgetsMiscellaneous/>
            },
            {
                path: "/help/knowledgebase",
                element: <HelpKnowledgebase />
            },

        ]
    },
    {
        path: "/",
        element: <LayoutApplications />,
        children: [
            {
                path: "/messages/chat",
                element: <AppsChat />
            },
            {
                path: "/volunteer/messages",
                element: <AppsChat />
            },
            {
                path: "/messages/email",
                element: <AppsEmail />
            },
            {
                path: "/applications/tasks",
                element: <AppsTasks />
            },
            {
                path: "/applications/notes",
                element: <AppsNotes />
            },
            {
                path: "/calendar",
                element: <AppsCalender />
            },
            {
                path: "/documents",
                element: <AppsStorage />
            },
        ]
    },
    {
        path: "/",
        element: <LayoutSetting />,
        children: [
            {
                path: "/settings/ganeral",
                element: <SettingsGaneral />
            },
            {
                path: "/settings/seo",
                element: <SettingsSeo />
            },
            {
                path: "/settings/tags",
                element: <SettingsTags />
            },
            {
                path: "/settings/email",
                element: <SettingsEmail />
            },
            {
                path: "/settings/tasks",
                element: <SettingsTasks />
            },
            {
                path: "/settings/leads",
                element: <SettingsLeads />
            },
            {
                path: "/settings/Support",
                element: <SettingsSupport />
            },
            {
                path: "/settings/finance",
                element: <SettingsFinance />
            },
            {
                path: "/settings/gateways",
                element: <SettingsGateways />
            },
            {
                path: "/settings/customers",
                element: <SettingsCustomers />
            },
            {
                path: "/settings/localization",
                element: <SettingsLocalization />
            },
            {
                path: "/settings/recaptcha",
                element: <SettingsRecaptcha />
            },
            {
                path: "/settings/miscellaneous",
                element: <SettingsMiscellaneous />
            },
        ]
    },
    {
        path: "/",
        element: <LayoutAuth />,
        children: [
            {
                path: "/signin",
                element: <LoginMinimal />
            },
            {
                path: "/signup",
                element: <RegisterMinimal />
            },
            {
                path: "/authentication/login/cover",
                element: <LoginCover />
            },
            {
                path: "/login",
                element: <LoginMinimal />
            },
            {
                path: "/authentication/login/creative",
                element: <LoginCreative />
            },
            {
                path: "/authentication/register/cover",
                element: <RegisterCover />
            },
            {
                path: "/authentication/register/minimal",
                element: <RegisterMinimal />
            },
            {
                path: "/authentication/register/creative",
                element: <RegisterCreative />
            },
            {
                path: "/authentication/reset/cover",
                element: <ResetCover />
            },
            {
                path: "/authentication/reset/minimal",
                element: <ResetMinimal />
            },
            {
                path: "/authentication/reset/creative",
                element: <ResetCreative />
            },
            {
                path: "/authentication/404/cover",
                element: <ErrorCover />
            },
            {
                path: "/authentication/404/minimal",
                element: <ErrorMinimal />
            },
            {
                path: "/authentication/404/creative",
                element: <ErrorCreative />
            },
            {
                path: "/authentication/verify/cover",
                element: <OtpCover />
            },
            {
                path: "/authentication/verify/minimal",
                element: <OtpMinimal />
            },
            {
                path: "/authentication/verify/creative",
                element: <OtpCreative />
            },
            {
                path: "/authentication/maintenance/cover",
                element: <MaintenanceCover />
            },
            {
                path: "/authentication/maintenance/minimal",
                element: <MaintenanceMinimal />
            },
            {
                path: "/authentication/maintenance/creative",
                element: <MaintenanceCreative />
            },
        ]
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        )
    },
])