import httpInstance from './httpInstance'

export interface Announcement {
    id: number
    title: string
    content: string
    imgUrl: string
    startTime: string
    endTime: string
    status: number
    createTime: string
}

export const announcementAPI = {
    getActiveAnnouncements() {
        return httpInstance.get<Announcement[]>('/machine/announcement/active')
    },
}
