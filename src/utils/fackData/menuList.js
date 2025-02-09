export const menuList = [
    {
        id: 0,
        name: "Home (dashboard)",
        path: "/",
        icon: 'feather-airplay',
        hideForVolunteer: true,
        dropdownMenu: []
    },
    {
        id: 1,
        name: "Events (My events)",
        path: "/events",
        icon: 'feather-clipboard',
        hideForVolunteer: true,
        dropdownMenu: []
    },
    {
        id: 2,
        name: "Volunteers",
        path: "/volunteers",
        icon: 'feather-user',
        hideForVolunteer: true,
        dropdownMenu: []
    },
    {
        id: 3,
        name: "Volunteer Dashboard",
        path: "/volunteer/home",
        icon: 'feather-user',
        hideForVolunteer: false,
        dropdownMenu: []
    },
    {
        id: 4,
        name: "Events (My events)",
        path: "/volunteer/events",
        icon: 'feather-clipboard',
        hideForVolunteer: false,
        dropdownMenu: []
    },
    {
        id: 4,
        name: "Messages",
        path: "/volunteer/messages",
        icon: 'feather-send',
        hideForVolunteer: false,
        dropdownMenu: []
    },
    {
        id: 5,
        name: "Rewards",
        icon: 'feather-award',
        path: "/volunteer/rewards",
        hideForVolunteer: false,
        dropdownMenu: []
    },
    {
        id: 5,
        name: "messages",
        path: '/messages',
        icon: 'feather-send',
        hideForVolunteer: true,
        dropdownMenu: [
            {
                id: 1,
                name: "Chat",
                path: "/messages/chat",
                subdropdownMenu: false
            },
            {
                id: 1,
                name: "Email",
                path: "/messages/email",
                subdropdownMenu: false
            },
        ]
    },
    {
        id: 6,
        name: "Documents",
        path: '/documents',
        icon: 'feather-archive',
        hideForVolunteer: true,
        dropdownMenu: [
        ]
    },
    {
        id: 5,
        name: "authentication",
        path: "#",
        icon: 'feather-power',
        hideForVolunteer: true,
        dropdownMenu: [
            {
                id: 1,
                name: "login",
                path: "#",
                subdropdownMenu: [
                    {
                        id: 2,
                        name: "Minimal",
                        path: "/login",
                    },

                ]
            },
            {
                id: 2,
                name: "register",
                path: "#",
                subdropdownMenu: [
                    {
                        id: 2,
                        name: "Minimal",
                        path: "/authentication/register/minimal",
                    },
                ]
            },
            {
                id: 3,
                name: "Error 404",
                path: "#",
                subdropdownMenu: [

                    {
                        id: 2,
                        name: "Minimal",
                        path: "/authentication/404/minimal",
                    },
                ]
            },
            {
                id: 4,
                name: "Reset Pass",
                path: "#",
                subdropdownMenu: [

                    {
                        id: 2,
                        name: "Minimal",
                        path: "/authentication/reset/minimal",
                    },

                ]
            },
            {
                id: 5,
                name: "Verify OTP",
                path: "#",
                subdropdownMenu: [

                    {
                        id: 2,
                        name: "Minimal",
                        path: "/authentication/verify/minimal",
                    },

                ]
            },
            {
                id: 6,
                name: "Maintenance",
                path: "#",
                subdropdownMenu: [
                    {
                        id: 2,
                        name: "Minimal",
                        path: "/authentication/maintenance/minimal",
                    },

                ]
            },
        ]
    },
    {
        id: 7,
        name: "Help Center",
        path: "https://Altruence.ai",
        icon: 'feather-life-buoy',
        hideForVolunteer: true,
        dropdownMenu: [

        ]
    },

]
