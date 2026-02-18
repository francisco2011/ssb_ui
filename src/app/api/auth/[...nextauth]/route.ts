import NextAuth from "next-auth"
import CognitoProvider from "next-auth/providers/cognito";

const providers = [
    CognitoProvider({
    clientId: process.env.COGNITO_CLIENT_ID??'',
    clientSecret: process.env.COGNITO_CLIENT_SECRET??'',
    issuer: process.env.COGNITO_ISSUER,
  })
  ]

export async function GET(req, res) {
  return await NextAuth(req, res, {
    providers,
  })
}

export async function POST(req, res) {
  return await NextAuth(req, res, {
    providers,
  })
}