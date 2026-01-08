import React, { useEffect, useRef,  } from "react";
import { BsStars } from "react-icons/bs";
import AddData from "./AddData";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import { handleGetPosts,  } from "../redux/features/postSlice";
import { useSession, signOut } from "next-auth/react";

const Feeds = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.value.posts);
  const hasMore = useSelector((state) => state.post.value.hasMore);
  const postRef = useRef(null);
  const { data: session } = useSession();

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 1.0,
      root: null,
      rootMargin: "0px",
    });
    if (postRef.current) observer.observe(postRef.current);

    return () => {
      postRef?.current && observer.disconnect();
    };
  }, [posts]);

  const handleIntersection = async (entries) => {
    if (entries[0].isIntersecting && hasMore) {
      dispatch(handleGetPosts({ skip: true }));
    }
  };

  useEffect(() => {
    dispatch(handleGetPosts({ skip: true }));
  }, []);
  return (
    <>
      <nav className="px-4 flex h-[4rem] items-center justify-between top-0 sticky bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm">
        <img
          onClick={() => signOut()}
          src={session?.user?.image}
          alt=""
          className="w-[2.5rem] h-[2.5rem] border-[0.005rem] sm:hidden rounded-full"
          onError={(e) => {
            e.currentTarget.src = "/assets/no-pictures.webp";
          }}
        />
        <img
          src="assets/logo-twitter.webp"
          className="w-[2.5rem] h-[2.5rem] sm:hidden"
        />
        <h5 className="text-xl hidden sm:block font-bold">Home</h5>
        <BsStars size="1.5rem" />
      </nav>
      <AddData type="post" />
      {posts?.map((data, i) => {
        return posts.length - 1 == i ? (
          <Post ref={postRef} key={i} data={data} />
        ) : (
          <Post key={i} data={data} />
        );
      })}
    </>
  );
};
export default Feeds;
