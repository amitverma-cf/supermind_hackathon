export type PostType = "Static" | "Video" | "Carousel" | "Story" | "Reel";

export type SocialData = {
    post_id: string
    post_type: PostType
    likes: number
    shares: number
    comments: number
    date_posted: Date
}

export interface ChartDataPoint {
    month: string;
    like: number;
    comment: number;
    share: number;
}