export interface User {
    name: string;
    avatarUrl: string;
  }
  
  export interface IEventLocation {
    name: string;
    latitude: number;
    longitude: number;
  }
  
  export interface IEventComment {
    user: User;
    timestamp: string;
    message: string;
  }
  
  export type IEventType = 'BEERS' | 'COCKTAILS' | 'COFFEES' | 'MILKSHAKES';
  
  export interface IEvent {
    id: number;
    time: string;
    title: string;
    creator: User;
    guests: User[];
    type: IEventType;
    location: IEventLocation;
    comments: IEventComment[];
  }

  export type IEventRes = {
    page: number
    pageSize: number
    total: number
    totalPages: number
    data: Array<IEvent>
  }
  