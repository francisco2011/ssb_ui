import NextAuth from "next-auth"
import provider from "next-auth/providers/github";
import { redirect } from "next/navigation";

const providers = [
    provider({
    clientId: process.env.GITHUB_CLIENT_ID??'',
    clientSecret: process.env.GITHUB_CLIENT_SECRET??'',
    //issuer: process.env.COGNITO_ISSUER,
  })
  ]

export async function GET(req, res) {
  return await NextAuth(req, res, {
    providers,
    callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      return true
    },
    async redirect({ url, baseUrl }){
      
      return baseUrl + "/admin/posts"
    }
  }})
}

export async function POST(req, res) {
  return await NextAuth(req, res, {
    providers,
  })
}