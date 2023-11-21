"use client";
import { useEffect } from "react";

import React from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Test() {
  const { data, error, isLoading } = useSWR(
    "http://10.1.114.43:3030/api/booking/allOpened",
    fetcher
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";

  return (
    <div>
      {data.map((post) => (
        <div key={post.id}>
          <h1>{post.userId}</h1>
          <p>{post.body}</p>
          <strong>👁 {post.title}</strong>
        </div>
      ))}
    </div>
  );
}
