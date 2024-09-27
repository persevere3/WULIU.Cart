// => <, >, &, ", ',
// ↵ => <br>

export function useUnescapeHTML(text) {
  function ql_handler() {
    let editorWidth = 0
    let editor_input = document.querySelector("#EditerWidth")
    if (editor_input) {
      editorWidth = editor_input.value * 1
    }

    let ql_editor = document.querySelector(".ql-editor")

    let rich_container = document.querySelector(".rich_container")

    if (!ql_editor || !rich_container) return

    let rich_container_width = parseFloat(
      window.getComputedStyle(rich_container).width
    )
    let rich_container_padding = parseFloat(
      window.getComputedStyle(rich_container).padding
    )
    if (rich_container_padding) {
      rich_container_width -= rich_container_padding * 2
    }

    if (editorWidth < rich_container_width) {
      ql_editor.style.width = editorWidth + "px"
    } else {
      ql_editor.style.width = rich_container_width + "px"
    }

    let imgs = document.querySelectorAll(".ql-editor img")
    for (let i = 0; i < imgs.length; i++) {
      let imgWidth = window.getComputedStyle(imgs[i]).width.split("px")[0] * 1

      if (imgWidth > editorWidth) {
        imgs[i].style.width = editorWidth + "px"
      }
    }

    let videos = document.querySelectorAll(".ql-editor .ql-video")
    for (let i = 0; i < videos.length; i++) {
      let videosWidth =
        window.getComputedStyle(videos[i]).width.split("px")[0] * 1
      if (videosWidth > editorWidth) {
        videos[i].style.width = editorWidth + "px"
      }
    }
  }

  nextTick(() => {
    ql_handler()
  })

  return String(text)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/↵/g, "<br>")
}
