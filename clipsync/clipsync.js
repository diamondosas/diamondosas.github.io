document.addEventListener('DOMContentLoaded', () => {
    const REPO_OWNER = 'diamondosas';
    const REPO_NAME = 'ClipSync';

    // Fetch repository details (Stars, Forks)
    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`)
        .then(response => response.json())
        .then(data => {
            if (data.stargazers_count !== undefined) {
                document.getElementById('stars-count').innerHTML = `<img src="https://api.iconify.design/mdi:star.svg" alt="star" class="icon-svg"> ${data.stargazers_count} Stars`;
                document.getElementById('forks-count').innerHTML = `<img src="https://api.iconify.design/mdi:source-fork.svg" alt="fork" class="icon-svg"> ${data.forks_count} Forks`;
            } else {
                document.getElementById('stars-count').innerHTML = `<img src="https://api.iconify.design/mdi:star.svg" alt="star" class="icon-svg"> Stars N/A`;
                document.getElementById('forks-count').innerHTML = `<img src="https://api.iconify.design/mdi:source-fork.svg" alt="fork" class="icon-svg"> Forks N/A`;
            }
        })
        .catch(err => {
            console.error("Error fetching repo stats", err);
            document.getElementById('stars-count').innerHTML = `<img src="https://api.iconify.design/mdi:star.svg" alt="star" class="icon-svg"> Error loading stars`;
            document.getElementById('forks-count').innerHTML = `<img src="https://api.iconify.design/mdi:source-fork.svg" alt="fork" class="icon-svg"> Error loading forks`;
        });

    // Fetch latest release details for downloads
    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`)
        .then(response => response.json())
        .then(data => {
            if (data && data.assets && data.assets.length > 0) {
                document.getElementById('version-label').innerText = data.tag_name || 'latest';

                const buttonsContainer = document.getElementById('download-buttons');
                const loadingText = document.getElementById('loading-releases');

                data.assets.forEach(asset => {
                    // We look for windows zip, mac tar.gz, linux tar.gz based on typical naming conventions
                    // But we will create a button for any zip or tar.gz we find to be safe.
                    let label = "Download";
                    let iconUrl = "https://api.iconify.design/mdi:tray-arrow-down.svg";
                    let iconAlt = "download";

                    if (asset.name.toLowerCase().includes('windows')) {
                        label = "Download for Windows";
                        iconUrl = "https://api.iconify.design/mdi:microsoft-windows.svg";
                        iconAlt = "windows";
                    } else if (asset.name.toLowerCase().includes('darwin') || asset.name.toLowerCase().includes('mac')) {
                        label = "Download for macOS";
                        iconUrl = "https://api.iconify.design/mdi:apple.svg";
                        iconAlt = "apple";
                    } else if (asset.name.toLowerCase().includes('linux')) {
                        label = "Download for Linux";
                        iconUrl = "https://api.iconify.design/mdi:linux.svg";
                        iconAlt = "linux";
                    } else {
                        label = `Download ${asset.name}`;
                    }

                    const btn = document.createElement('a');
                    btn.href = asset.browser_download_url;
                    btn.className = 'download-btn';
                    btn.innerHTML = `<img src="${iconUrl}" alt="${iconAlt}" class="icon-svg"> ${label}`;

                    buttonsContainer.appendChild(btn);
                });

                loadingText.style.display = 'none';
                buttonsContainer.style.display = 'block';

            } else {
                document.getElementById('loading-releases').innerText = 'No release downloads found.';
            }
        })
        .catch(err => {
            console.error("Error fetching release data", err);
            document.getElementById('loading-releases').innerText = 'Error fetching release downloads.';
        });
});