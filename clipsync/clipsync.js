document.addEventListener('DOMContentLoaded', () => {
    const REPO_OWNER = 'diamondosas';
    const REPO_NAME = 'ClipSync';

    // Fetch repository details (Stars, Forks)
    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`)
        .then(response => response.json())
        .then(data => {
            if (data.stargazers_count !== undefined) {
                document.getElementById('stars-count').innerText = `⭐ ${data.stargazers_count} Stars`;
                document.getElementById('forks-count').innerText = `🍴 ${data.forks_count} Forks`;
            } else {
                document.getElementById('stars-count').innerText = `⭐ Stars N/A`;
                document.getElementById('forks-count').innerText = `🍴 Forks N/A`;
            }
        })
        .catch(err => {
            console.error("Error fetching repo stats", err);
            document.getElementById('stars-count').innerText = `⭐ Error loading stars`;
            document.getElementById('forks-count').innerText = `🍴 Error loading forks`;
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
                    let icon = "📥";

                    if (asset.name.toLowerCase().includes('windows')) {
                        label = "Download for Windows";
                        icon = "🪟";
                    } else if (asset.name.toLowerCase().includes('darwin') || asset.name.toLowerCase().includes('mac')) {
                        label = "Download for macOS";
                        icon = "🍎";
                    } else if (asset.name.toLowerCase().includes('linux')) {
                        label = "Download for Linux";
                        icon = "🐧";
                    } else {
                        label = `Download ${asset.name}`;
                    }

                    const btn = document.createElement('a');
                    btn.href = asset.browser_download_url;
                    btn.className = 'download-btn';
                    btn.innerText = `${icon} ${label}`;

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