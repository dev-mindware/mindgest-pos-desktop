import type { AxiosResponse } from "axios";

export function triggerBrowserDownload(
  response: AxiosResponse<Blob>,
  filename: string,
) {
  // Ensure we have a Blob with the correct type
  const blob = new Blob([response.data], {
    type: "application/pdf",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);

  // Revoke after a short delay to ensure the browser has started the download
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
}

export function triggerBrowserPreview(response: AxiosResponse<Blob>) {
  const blob = new Blob([response.data], {
    type: "application/pdf",
  });

  const url = window.URL.createObjectURL(blob);
  const newTab = window.open(url, "_blank");

  if (newTab) {
    newTab.focus();
  } else {
    // If popup is blocked, we can try to use a link click as fallback
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Note: We don't revoke immediately because the new tab needs the URL.
  // Modern browsers handle blob URLs in new tabs well even if we don't revoke.
}
