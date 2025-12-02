export interface StoryPage {
    pageNumber: number;
    text: string;
    imageUrl?: string;
    summary: string;
  }
  
  export interface Story {
    id?: string;
    userId: string;
    title: string;
    pages: StoryPage[];
    pdfUrl?: string;
    status: 'generating' | 'completed';
    createdAt?: Date;
  }
  
  export interface GenerateStoryRequest {
    prompt: string;
  }
  
  export interface GenerateStoryResponse {
    story: Story;
  }