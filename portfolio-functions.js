// ============================================
// PORTFOLIO FUNCTIONS - Enhanced Interactions
// ============================================

(function() {
  'use strict';

  // ===== Profile Picture Upload =====
  const profileImg = document.getElementById('profile-img');
  const profileUpload = document.getElementById('profile-upload');
  const uploadOverlay = document.querySelector('.upload-overlay');

  if (profileImg && uploadOverlay) {
    profileImg.addEventListener('click', () => profileUpload.click());
    uploadOverlay.addEventListener('click', () => profileUpload.click());
  }

  if (profileUpload) {
    profileUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          profileImg.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ===== Add Education =====
  const addEducationBtn = document.getElementById('add-education-btn');
  if (addEducationBtn) {
    addEducationBtn.addEventListener('click', function() {
      const container = document.getElementById('education-container');
      const newEdu = document.createElement('div');
      newEdu.className = 'education-card';
      newEdu.innerHTML = `
        <div class="card-glow"></div>
        <div class="edu-degree" contenteditable="true">Degree Name</div>
        <div class="edu-school" contenteditable="true">Institution Name</div>
        <div class="edu-year" contenteditable="true">Year</div>
        <div class="edu-major" contenteditable="true">Major/Specialization</div>
        <button class="delete-btn">🗑️</button>
      `;
      container.appendChild(newEdu);
      attachDeleteHandler(newEdu.querySelector('.delete-btn'));
      newEdu.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Focus on degree field
      setTimeout(() => {
        newEdu.querySelector('.edu-degree').focus();
      }, 300);
    });
  }

  // ===== Add Experience =====
  const addExperienceBtn = document.getElementById('add-experience-btn');
  if (addExperienceBtn) {
    addExperienceBtn.addEventListener('click', function() {
      const container = document.getElementById('experience-container');
      const newExp = document.createElement('div');
      newExp.className = 'experience-card';
      newExp.innerHTML = `
        <div class="card-glow"></div>
        <div class="exp-title" contenteditable="true">Job Title</div>
        <div class="exp-description" contenteditable="true">Job description and responsibilities...</div>
        <button class="delete-btn">🗑️</button>
      `;
      container.appendChild(newExp);
      attachDeleteHandler(newExp.querySelector('.delete-btn'));
      newExp.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Focus on title field
      setTimeout(() => {
        newExp.querySelector('.exp-title').focus();
      }, 300);
    });
  }

  // ===== Add Skill =====
  const addSkillBtn = document.getElementById('add-skill-btn');
  if (addSkillBtn) {
    addSkillBtn.addEventListener('click', function() {
      const container = document.getElementById('skills-container');
      const newSkill = document.createElement('div');
      newSkill.className = 'skill-badge';
      newSkill.contentEditable = 'true';
      newSkill.textContent = 'New Skill';
      container.appendChild(newSkill);
      newSkill.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Focus and select text
      setTimeout(() => {
        newSkill.focus();
        document.execCommand('selectAll', false, null);
      }, 300);
    });
  }

  // ===== Add Project =====
  const addProjectBtn = document.getElementById('add-project-btn');
  if (addProjectBtn) {
    addProjectBtn.addEventListener('click', function() {
      const container = document.getElementById('projects-container');
      const newProject = document.createElement('div');
      newProject.className = 'project-card modern-card';
      newProject.setAttribute('data-link', '');
      newProject.innerHTML = `
        <div class="card-shine"></div>
        <div class="project-image-wrapper">
          <input type="file" accept="image/*" style="display:none;" class="image-upload">
          <div class="project-image">
            <span class="upload-text">💡<br>Click to upload</span>
          </div>
        </div>
        <div class="project-content">
          <div class="project-category" contenteditable="true">Category</div>
          <h3 contenteditable="true">Project Title</h3>
          <p contenteditable="true">Project description...</p>
          <div class="project-tags">
            <span class="project-tag" contenteditable="true">Tag1</span>
            <span class="project-tag" contenteditable="true">Tag2</span>
          </div>
          <input type="text" class="project-link-input" placeholder="🔗 Project URL" value="">
        </div>
        <button class="delete-btn delete-project-btn">🗑️</button>
      `;
      container.appendChild(newProject);
      attachProjectImageUpload(newProject);
      attachProjectLinkHandler(newProject);
      attachDeleteHandler(newProject.querySelector('.delete-btn'));
      newProject.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ===== Add Blog =====
  const addBlogBtn = document.getElementById('add-blog-btn');
  if (addBlogBtn) {
    addBlogBtn.addEventListener('click', function() {
      const container = document.getElementById('blogs-container');
      const newBlog = document.createElement('div');
      newBlog.className = 'blog-card modern-card';
      newBlog.setAttribute('data-link', '');
      newBlog.innerHTML = `
        <div class="card-shine"></div>
        <div class="blog-image-wrapper">
          <input type="file" accept="image/*" style="display:none;" class="image-upload">
          <div class="blog-image">
            <span class="upload-text">✨<br>Click to upload</span>
          </div>
        </div>
        <div class="blog-content">
          <div class="blog-date" contenteditable="true">📅 Date</div>
          <h3 contenteditable="true">Blog Title</h3>
          <p contenteditable="true">Blog description...</p>
          <div class="blog-tags">
            <span class="blog-tag" contenteditable="true">Tag1</span>
            <span class="blog-tag" contenteditable="true">Tag2</span>
          </div>
          <input type="text" class="blog-link-input" placeholder="🔗 Blog URL" value="">
        </div>
        <button class="delete-btn delete-blog-btn">🗑️</button>
      `;
      container.appendChild(newBlog);
      attachBlogImageUpload(newBlog);
      attachBlogLinkHandler(newBlog);
      attachDeleteHandler(newBlog.querySelector('.delete-btn'));
      newBlog.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ===== Delete Handler =====
  function attachDeleteHandler(button) {
    if (button) {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        if (confirm('Delete this item?')) {
          const parent = button.parentElement;
          parent.style.animation = 'fadeOutScale 0.3s ease';
          setTimeout(() => parent.remove(), 300);
        }
      });
    }
  }

  // Attach to existing delete buttons
  document.querySelectorAll('.delete-btn').forEach(attachDeleteHandler);

  // ===== Project Image Upload =====
  function attachProjectImageUpload(projectCard) {
    const imageDiv = projectCard.querySelector('.project-image');
    const fileInput = projectCard.querySelector('.image-upload');

    if (imageDiv && fileInput) {
      imageDiv.addEventListener('click', function(e) {
        e.stopPropagation();
        fileInput.click();
      });

      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            imageDiv.style.backgroundImage = `url(${event.target.result})`;
            imageDiv.style.backgroundSize = 'cover';
            imageDiv.style.backgroundPosition = 'center';
            const uploadText = imageDiv.querySelector('.upload-text');
            if (uploadText) uploadText.style.display = 'none';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  // Attach to existing projects
  document.querySelectorAll('.project-card').forEach(attachProjectImageUpload);

  // ===== Blog Image Upload =====
  function attachBlogImageUpload(blogCard) {
    const imageDiv = blogCard.querySelector('.blog-image');
    const fileInput = blogCard.querySelector('.image-upload');

    if (imageDiv && fileInput) {
      imageDiv.addEventListener('click', function(e) {
        e.stopPropagation();
        fileInput.click();
      });

      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            imageDiv.style.backgroundImage = `url(${event.target.result})`;
            imageDiv.style.backgroundSize = 'cover';
            imageDiv.style.backgroundPosition = 'center';
            const uploadText = imageDiv.querySelector('.upload-text');
            if (uploadText) uploadText.style.display = 'none';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  // Attach to existing blogs
  document.querySelectorAll('.blog-card').forEach(attachBlogImageUpload);

  // ===== Project Link Handler =====
  function attachProjectLinkHandler(projectCard) {
    const linkInput = projectCard.querySelector('.project-link-input');
    
    if (linkInput) {
      linkInput.addEventListener('input', function() {
        projectCard.setAttribute('data-link', this.value);
      });

      linkInput.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }

    projectCard.addEventListener('click', function(e) {
      if (e.target.contentEditable === 'true' || 
          e.target.classList.contains('delete-btn') ||
          e.target.closest('.project-image-wrapper') ||
          e.target.tagName === 'INPUT') {
        return;
      }

      const link = projectCard.getAttribute('data-link');
      if (link && link.trim() !== '') {
        window.open(link, '_blank');
      }
    });
  }

  document.querySelectorAll('.project-card').forEach(attachProjectLinkHandler);

  // ===== Blog Link Handler =====
  function attachBlogLinkHandler(blogCard) {
    const linkInput = blogCard.querySelector('.blog-link-input');
    
    if (linkInput) {
      linkInput.addEventListener('input', function() {
        blogCard.setAttribute('data-link', this.value);
      });

      linkInput.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }

    blogCard.addEventListener('click', function(e) {
      if (e.target.contentEditable === 'true' || 
          e.target.classList.contains('delete-btn') ||
          e.target.closest('.blog-image-wrapper') ||
          e.target.tagName === 'INPUT') {
        return;
      }

      const link = blogCard.getAttribute('data-link');
      if (link && link.trim() !== '') {
        window.open(link, '_blank');
      }
    });
  }

  document.querySelectorAll('.blog-card').forEach(attachBlogLinkHandler);

  // ===== Contact Link Handler =====
  document.querySelectorAll('.contact-link-item').forEach(contactItem => {
    const linkInput = contactItem.querySelector('.contact-link-input');
    
    if (linkInput) {
      linkInput.addEventListener('input', function() {
        contactItem.setAttribute('data-link', this.value);
      });

      linkInput.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }

    contactItem.addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return;

      const link = contactItem.getAttribute('data-link');
      if (link && link.trim() !== '') {
        window.open(link, '_blank');
      }
    });
  });

  // ===== Smooth Reveal on Load =====
  window.addEventListener('load', function() {
    document.querySelectorAll('[data-scroll-reveal]').forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, index * 100);
    });
  });

  // Add fade out animation style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOutScale {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.9);
      }
    }
  `;
  document.head.appendChild(style);

  console.log('✅ Portfolio functions loaded successfully!');

})();
