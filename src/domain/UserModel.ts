export interface UserModel {
  id: string
  firstName: string
  lastName: string
  imgUrl: string
  userName: string
  email: string
  phone: {
    number: string
    verified: boolean
  }
  sex: 'male' | 'female'
  birthday: string
  lang: 'en' | 'de'
  country: string
  city: string
  address1: string
  address2?: string
  zipcode: number
  website?: string
  socials?: {
    twitter?: string
    facebook?: string
    linkedin?: string
  }
  roles: [
    {
      name: string
      _id?: string
      createdAt?: Date
    }
  ]
  customer: {
    _id: string
  }
}

//ter
