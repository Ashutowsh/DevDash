import { Bot, CreditCard, LayoutDashboard, Presentation } from "lucide-react";
const sidebarItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard
    },

    {
        title: "Q&A",
        url: "/qa",
        icon: Bot
    }, 

    {
        title: "Meetings",
        url : "/meetings",
        icon: Presentation
    },

    {
        title: "Billing",
        url: "/billing",
        icon: CreditCard
    }
]

const projects = [
    {
        name : "Project 1",
    }, 
    {
        name : "Project 2",
    },
    {
        name : "Project 3",
    },
    {
        name : "Project 4",
    }
]

export {
    sidebarItems,
    projects
}