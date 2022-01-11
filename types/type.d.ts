declare namespace UPV {
  // Response from the server
  namespace R {
    export interface Response {
      code: number
      msg?: string
      data: any
    }

    export interface User {
      id: number
      level: number
      name: string
      create_time: string
      update_time: string
      status: number
      bio: string
      avatar: string
      qq: string
      nickname: string
    }
  }
}
