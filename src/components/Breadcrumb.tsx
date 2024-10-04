import { FC } from "react";
import Icon from "./Icons";
import Link from "next/link";

interface custom_props {
  sub_page_1?: string;
  active_page?: string;
  sub_page_2?: string;
  sub_page_3?: string;
  sub_page_4?: string;
}

const Breadcrumb: FC<custom_props> = ({
  sub_page_1,
  active_page,
  sub_page_2,
  sub_page_3,
  sub_page_4,
}) => {
  const border = `
    border
    border-neutral-800
    bg-neutral-950/50 backdrop-blur
  `;

  const text = `
    text-neutral-600/60
    fill-neutral-600/60
  `;

  const active_text = `
    text-neutral-300/60
    fill-neutral-300/60
  `;

  const hover = `
    transition-all
    duration-300
    hover:scale-105
    group-hover:fill-violet-400
    group-hover:text-violet-400
    group-hover:border-violet-400
  `;

  return (
    <div className="flex text-sm rounded-lg pb-4 px-1">
      <ul className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
        <li className="group">
          <Link
            href={'/'}
            as={'/'}
          >
            <div className={`${border} ${hover} ${text} p-0.5 inline-flex items-center rounded-lg`}>
              <span className="px-2">
                <svg
                  className={`size-4`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
                </svg>
              </span>
              <span className={`h-auto font-medium px-2`}>/</span>
            </div>
          </Link>
        </li>

        {sub_page_1 && (
          <li className="group">
            <Link
              href={'/' + sub_page_1.toLocaleLowerCase()}
              as={"/" + sub_page_1?.toLocaleLowerCase()}
            >
              <div className={`${border} ${hover} ${text} p-0.5 inline-flex items-center rounded-lg`}>
                <span className="px-2 font-medium uppercase tracking-wider">{sub_page_1}</span>
                <span className="h-auto font-medium px-2">/</span>
              </div>
            </Link>
          </li>
        )}

        {sub_page_2 && (
          <li className="group">
            <Link
              href={"/" + sub_page_1?.toLocaleLowerCase() + "/" + sub_page_2.toLocaleLowerCase()}
              as={"/" + sub_page_1?.toLocaleLowerCase() + "/" + sub_page_2?.toLocaleLowerCase()}
            >
              <div className={`${border} ${hover} ${text} p-0.5 inline-flex items-center rounded-lg`}>
                <span className="px-2 font-medium uppercase tracking-wider">{sub_page_2}</span>
                <span className="h-auto font-medium px-2">/</span>
              </div>
            </Link>
          </li>
        )}

        {sub_page_3 && (
          <li className="group">
            <Link
              href={"/" + sub_page_1?.toLocaleLowerCase() + "/" + sub_page_2?.toLocaleLowerCase() + "/" + sub_page_3.toLocaleLowerCase()}
              as={"/" + sub_page_1?.toLocaleLowerCase() + "/" + sub_page_2?.toLocaleLowerCase() + "/" + sub_page_3?.toLocaleLowerCase()}
            >
              <div className={`${border} ${hover} ${text} p-0.5 inline-flex items-center rounded-lg`}>
                <span className="px-2 font-medium uppercase tracking-wider">{sub_page_3}</span>
                <span className="h-auto font-medium px-2">/</span>
              </div>
            </Link>
          </li>
        )}

        {sub_page_4 && (
          <li className="group">
            <Link
              href={"/" + sub_page_1?.toLocaleLowerCase() + "/" + sub_page_2?.toLocaleLowerCase() + "/" + sub_page_3?.toLocaleLowerCase() + "/" + sub_page_4.toLocaleLowerCase()}
              as={"/" + sub_page_1?.toLocaleLowerCase() + "/" + sub_page_2?.toLocaleLowerCase() + "/" + sub_page_3?.toLocaleLowerCase() + "/" + sub_page_4.toLocaleLowerCase()}
            >
              <div className={`${border} ${hover} ${text} p-0.5 inline-flex items-center rounded-lg`}>
                <span className="px-2 font-medium uppercase tracking-wider">{sub_page_4}</span>
                <span className="h-auto font-medium px-2">/</span>
              </div>
            </Link>
          </li>
        )}

        {active_page && (
          <li className="group">
            <Link
              href={'#'}
            >
              <div className={`${border} ${hover} ${active_text} p-0.5 inline-flex items-center rounded-lg`}>
                <span className="px-2 tracking-widest font-bold">
                  {active_page.toUpperCase()}
                </span>
                {sub_page_1 === "Tokens" && (
                  <Icon icon="logo" extra_class="size-4 mx-1" />
                )}
                {sub_page_1 === "Pools" && (
                  <Icon icon="pool" extra_class="size-4 mx-1" />
                )}
                {(sub_page_1 === "Curators" || sub_page_1 === "Forums") && (
                  <Icon icon="curator_solid" extra_class="size-4 mx-1" />
                )}
                {(sub_page_1 === "Development" ||
                  active_page === "Development") && (
                  <Icon icon="development" extra_class="size-4 mx-1" />
                )}
                {(active_page === "Tokens" || active_page === "Pools" || active_page === "Curators") && (
                  <Icon icon="search" extra_class="size-4 mx-1" />
                )}
                {(active_page === "Forums") && (
                  <Icon icon="curator_solid" extra_class="size-4 mx-1" />
                )}
              </div>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Breadcrumb;
