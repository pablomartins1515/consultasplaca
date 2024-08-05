import React from 'react';
import ReactPlayer from 'react-player';
import { useGetLessonBySlugQuery } from "../graphql/generated";
import BottomWhatsApp from "./BottomWhatsApp";
import Pesquisador from './Etapa1ConsultaCaptura';


interface VideoProps {
  lessonSlug: string;
}

export default function MainBlog(props: VideoProps) {

  const { data } = useGetLessonBySlugQuery({
    variables: {
      slug: props.lessonSlug
    }
  });

  if (!data || !data.lesson) {
    return (
      <div className="flex-1">
        <span>carregando...</span>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="pt-12 pr-4 mt-3 max-w-[1020px] mx-auto">
        <div className="flex items-start gap-16">
          <div className="flex-1 ml-8">
            <h1 className="text-5xl font-bold mb-5 text-blue-900 leading-tight">
              {data.lesson.title}
            </h1>
            <div>
              <div className="text-lg mb-7 text-gray-700">
                {data.lesson.blogtext}
              </div>
            </div>


            <div className='flex flex-1 justify-center'>
              {data.lesson.asset && (
                <div className="leading-relaxed">
                  <div className="flex flex-1 items-center gap-4 mt-2 mb-8">
                    {// eslint-disable-next-line @next/next/no-img-element
                      <img
                        className=" max-h-25"
                        src={data.lesson.asset?.url}
                        alt=""
                      />
                    }
                  </div>
                </div>
              )}

            </div>

            <div>
              <div className="text-3xl mb-4 text-gray-600">
                <strong>
                  {data.lesson.subtext2}
                </strong>
              </div>
              <div className="text-lg mb-10">
                {data.lesson.blogtext2}
              </div>
            </div>
            <div className="flex items-center pl-8 pr-8">
              <div className="h-full border-l-4 border-blue-900 mr-4">
                <h1 className="text-4xl m-0 p-0 text-gray-500"></h1>
                <h1 className="text-4xl m-0 ml-4 text-gray-500">
                  <span>
                    {data.lesson.textcenter}
                  </span>
                </h1>
              </div>
            </div>
            <div>
              <div className="text-3xl mb-4 mt-10 text-gray-600">
              </div>
              <span className="text-lg mb-8">
                {data.lesson.blogtext3}
              </span>
            </div>

            <div className='mt-2'></div>

            <span className="mb-8">
              <Pesquisador />
            </span>
            <div>
              <div className="text-3xl mb-4 mt-12 text-gray-600">
                <strong>
                  {data.lesson.subtext4}
                </strong>
              </div>
              <span className="text-lg mb-6">
                {data.lesson.blogtext4}
              </span>
            </div>
            <div>
              <div className="mt-6 text-3xl mb-4 text-gray-600">
                <strong>
                  {data.lesson.subtext5}
                </strong>
              </div>
              <span className="text-lg mb-6">
                {data.lesson.blogtext5}
              </span>
            </div>

            <div className="relative aspect-w-16 aspect-h-9 player-wrapper mt-10">
              <ReactPlayer
                className='react-player'
                url={`${data.lesson.videoId}`}
                controls={true}
                width="100%"
                height="400px"
              />
            </div>

            <div>
              <div className="text-xl mt-8 mb-12 text-gray-500 leading-relaxed">
                <span>{data.lesson.description}</span>
              </div>
            </div>

            {data.lesson.teacher && (
              <div className="flex items-center gap-4 mt-6">


                <div className="leading-relaxed">



                  <div className="flex items-center gap-4 mt-6">
                    {// eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="h-16 w-16 rounded-full border-2 border-blue-900"
                        src={data.lesson.teacher.avatarURL}
                        alt=""
                      />
                    }
                  </div>

                  <strong className="font-bold text-2xl block">
                    {data.lesson.teacher.name}
                  </strong>

                  <strong className="text-gray-500 text-xs block">
                    {data.lesson.teacher.bio}
                  </strong>

                </div>
              </div>
            )}

            <div className='flex-auto BottomStyle fixed bottom-3 right-1  h-15 w-16 cursor-pointer'>
              <BottomWhatsApp />
            </div>

          </div>
        </div>
      </div>

    </div >
  );
}
