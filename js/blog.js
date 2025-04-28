/* blog.js – list of posts with tag filter */
function renderPosts(posts, filterTag=null){
    const list = document.getElementById("posts-list");
    list.innerHTML="";
  
    posts.forEach(post=>{
      if(filterTag && !(post.tags||[]).includes(filterTag)) return;
  
      const entry = document.createElement("div");
      entry.className="post-entry";
  
      const title = document.createElement("a");
      title.href = `post.html?id=${post.slug}`;
      title.textContent = post.title;
      title.className = "post-title";
  
      const meta = document.createElement("div");
      meta.className="post-meta-inline";
      meta.textContent = `${post.date}${post.author?` • by ${post.author}`:""}`;
  
      const tagsDiv = document.createElement("div");
      (post.tags||[]).forEach(t=>{
        const span=document.createElement("span");
        span.className="post-tag"; span.textContent=t; tagsDiv.appendChild(span);
      });
  
      entry.append(title, meta, tagsDiv);
      list.appendChild(entry);
    });
  }
  
  fetch("/posts/metadata/entries.json")
    .then(r=>r.json())
    .then(posts=>{
      renderPosts(posts);
  
      /* build tag buttons */
      const btnBox=document.getElementById("tag-buttons");
      const tags=[...new Set(posts.flatMap(p=>p.tags||[]))];
      const mk=(txt,cb)=>{
        const b=document.createElement("button"); b.textContent=txt;
        b.className="tag-button"; b.addEventListener("click",cb); return b;
      };
      btnBox.appendChild(mk("All",()=>renderPosts(posts,null)));
      tags.forEach(tag=>{
        btnBox.appendChild(mk(tag,()=>renderPosts(posts,tag)));
      });
    })
    .catch(err=>{
      console.error("Failed to load posts",err);
      document.getElementById("posts-list").innerHTML="<p>Unable to load posts.</p>";
    });
  