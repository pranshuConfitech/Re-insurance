export interface PageRequest {
  page: number;
  size: number;
  summary: boolean;
  active?:boolean;
  sort?:Array<any>;
}

export const defaultPageRequest: PageRequest = {
  page: 0,
  size: 10,
  summary: true,
  active: true,

  // sort:['dsc']
};

export const defaultPageRequest2: PageRequest = {
  page: 0,
  size: 10,
  summary: true,
  active: true,
};
