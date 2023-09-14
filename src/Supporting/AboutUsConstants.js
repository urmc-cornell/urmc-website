import slackIcon from '../images/assets/mdi_slack.png'
import examIcon from '../images/assets/mdi_pencil-box.png'
import studyIcon from '../images/assets/mdi_book.png'
import taIcon from '../images/assets/ph_chalkboard-teacher-fill.png'

import handshakeIcon from '../images/assets/solid_handshake-angle.png'
import gbodyIcon from '../images/assets/mdi_talking.png'
import wifiIcon from '../images/assets/wifi_bar.png'
import socialIcon from '../images/assets/movie-filter.png'

import messageIcon from '../images/assets/ic_round-question-answer.png'
import corporateIcon from '../images/assets/mdi_company.png'
import codeIcon from '../images/assets/material-symbols_code-blocks.png'
import resumeIcon from '../images/assets/mdi_resume.png'

import a1 from '../images/carousel/academic/a1.png'
import a2 from '../images/carousel/academic/a2.png'
import a3 from '../images/carousel/academic/a3.png'
import a4 from '../images/carousel/academic/a4.png'

import c1 from '../images/carousel/community/c1.JPG'
import c2 from '../images/carousel/community/c2.JPG'
import c3 from '../images/carousel/community/c3.JPG'
import c4 from '../images/carousel/community/c4.JPG'

import p1 from '../images/carousel/professional/p1.JPG'
import p2 from '../images/carousel/professional/p2.JPG'
import p3 from '../images/carousel/professional/p3.JPG'



export const Academic = {
    
    CarouselImages: [a1,a2,a3,a4],
    Card: {
        title: "Ensuring academic success",
        body: "Our wonderful academic chairs work to uphold and facilitate academic success. It is crucial that GBody members feel supported academically but more importantly, never feel alone."
    },

    Widget: {
        Slack: {
            icon: slackIcon,
            title: "Peer to peer communication",
            body: "Class channels on Slack"
        },
        Exam: {
            icon: examIcon,
            title: "Exam preparation",
            body: "Prelim review sessions"
        },
        Study: {
            icon: studyIcon,
            title: "Study time & spaces",
            body: "Weekly office hours"
        },
        TA: {
            icon: taIcon,
            title: "Teaching Assistants",
            body: "Access to TA network & events"
        }
    }
}

export const Community = {
    CarouselImages: [c1,c2,c3,c4],
    Card: {
        title: "Building community",
        body: "The family we have created sets us apart from other organizations and really helps our members to thrive. Outreach puts all of their efforts into strengthening the community and also attracting more people into this family, regardless of their major!"
    },

    Widget: {
        Slack: {
            icon: handshakeIcon,
            title: "Mentorship",
            body: "M&M Mentorship Program"
        },
        Exam: {
            icon: gbodyIcon,
            title: "General Body Meetings",
            body: "Peer discussion and goals"
        },
        Study: {
            icon: wifiIcon,
            title: "Outreach",
            body: "Freshman Under the Hood Series"
        },
        TA: {
            icon: socialIcon,
            title: "Social Outings",
            body: "Movies, bowling, skating, etc. "
        }
    }
}

export const Professional = {
    CarouselImages: [p1,p2,p3],
    Card: {
        title: "Promoting professional excellence",
        body: "Our amazing professional development chairs work to promote professional excellence. Working to help our members grow at the very beginning of their professional careers, and supporting URMs as they explore their interests."
    },

    Widget: {
        Slack: {
            icon: messageIcon,
            title: "Interview Preparation",
            body: "Mock Interviews & questions"
        },
        Exam: {
            icon: corporateIcon,
            title: "Corporate Events",
            body: "Company recruitment"
        },
        Study: {
            icon: codeIcon,
            title: "Workshops",
            body: "Technical skills reviews"
        },
        TA: {
            icon: resumeIcon,
            title: "Resumes",
            body: "Resume reviews & resume book"
        }
    }
}