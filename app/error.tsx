"use client";
import NextError from "next/error";
export default function error({error} : {error: Error}) {
  return (
    <>
    <NextError statusCode={500} title={error.message}/>
<p>Error: {error.message}</p>
    </>
  )
}
