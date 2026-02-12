import { MDXRemote } from "next-mdx-remote/rsc";

const components = {
    h1: (props: any) => <h1 {...props} className="text-3xl font-bold mt-8 mb-4 text-white" />,
    h2: (props: any) => <h2 {...props} className="text-2xl font-bold mt-6 mb-3 text-white" />,
    p: (props: any) => <p {...props} className="mb-4 leading-relaxed text-neutral-300" />,
    ul: (props: any) => <ul {...props} className="list-disc list-inside mb-4 text-neutral-300" />,
    li: (props: any) => <li {...props} className="mb-1" />,
    a: (props: any) => <a {...props} className="text-indigo-400 hover:text-indigo-300 underline" />,
    blockquote: (props: any) => <blockquote {...props} className="border-l-4 border-indigo-500 pl-4 italic my-4 text-neutral-400" />,
    code: (props: any) => <code {...props} className="bg-neutral-800 rounded px-1 py-0.5 text-sm font-mono text-indigo-300" />,
};

export function MdxRenderer({ source }: { source: string }) {
    return (
        <div className="prose prose-invert max-w-none">
            <MDXRemote source={source} components={components} />
        </div>
    );
}
