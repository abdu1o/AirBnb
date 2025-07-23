import connectionToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectionToDatabase();
    } catch (error) {
        console.log(error);
    }
}