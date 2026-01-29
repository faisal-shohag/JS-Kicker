import React, { useEffect, useRef } from 'react';

const ManualChecker: React.FC = () => {
  const code = `//paste code here`;
  const cmRef = useRef<any>(null);
  const createdElsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const cssUrls = [
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/material-darker.min.css',
    ];
    const scriptUrls = [
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/closebrackets.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/closetag.min.js',
    ];

    const appendCss = (href: string) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      createdElsRef.current.push(link);
    };

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        // If CodeMirror already loaded, skip reloading the core script
        if ((window as any).CodeMirror && /codemirror(?:\.min)?\.js/.test(src)) {
          resolve();
          return;
        }
        const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => reject(new Error('Failed to load ' + src)));
          return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => {
          createdElsRef.current.push(s);
          resolve();
        };
        s.onerror = () => reject(new Error('Failed to load ' + src));
        document.body.appendChild(s);
      });

    (async () => {
      try {
        cssUrls.forEach(appendCss);
        for (const src of scriptUrls) {
          await loadScript(src);
        }
        const CodeMirror = (window as any).CodeMirror;
        if (!CodeMirror) return;
        const textarea = document.getElementById('studentCode') as HTMLTextAreaElement | null;
        if (!textarea) return;
        cmRef.current = CodeMirror.fromTextArea(textarea, {
          mode: 'javascript',
          theme: 'material-darker',
          lineNumbers: true,
          autoCloseBrackets: true,
          autoCloseTags: true,
          tabSize: 2,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load CodeMirror', err);
      }
    })();

    return () => {
      if (cmRef.current && typeof cmRef.current.toTextArea === 'function') {
        try {
          cmRef.current.toTextArea();
        } catch {}
        cmRef.current = null;
      }
      createdElsRef.current.forEach(el => el.parentNode?.removeChild(el));
      createdElsRef.current = [];
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manual Checker</h2>
      <textarea id="studentCode" defaultValue={code} className="w-full h-64 border rounded" />
    </div>
  );
};

export default ManualChecker;