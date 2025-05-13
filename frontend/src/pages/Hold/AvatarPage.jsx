const AvatarPage = () => {
    const subdomain = 'demo'; // Replace with your custom subdomain
    const frame = document.getElementById('frame');

    frame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`;

    window.addEventListener('message', subscribe);
    document.addEventListener('message', subscribe);

    function subscribe(event) {
        const json = parse(event);

        if (json?.source !== 'readyplayerme') {
            return;
        }

        // Susbribe to all events sent from Ready Player Me once frame is ready
        if (json.eventName === 'v1.frame.ready') {
            frame.contentWindow.postMessage(
                JSON.stringify({
                    target: 'readyplayerme',
                    type: 'subscribe',
                    eventName: 'v1.**'
                }),
                '*'
            );
        }

        // Get avatar GLB URL
        if (json.eventName === 'v1.avatar.exported') {
            console.log(`Avatar URL: ${json.data.url}`);
            document.getElementById('avatarUrl').innerHTML = `Avatar URL: ${json.data.url}`;
            document.getElementById('frame').hidden = true;
        }

        // Get user id
        if (json.eventName === 'v1.user.set') {
            console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
        }
    }

    function parse(event) {
        try {
            return JSON.parse(event.data);
        } catch (error) {
            return null;
        }
    }

    function displayIframe() {
        document.getElementById('frame').hidden = false;
    }
  
  return (
<>
    <h2>Ready Player Me iframe example</h2>
    <ul>
        <li>Click the "Open Ready Player Me" button.</li>
        <li>Create an avatar and click the "Done" button when you're done customizing.</li>
        <li>After creation, this parent page receives the URL to the avatar.</li>
        <li>The Ready Player Me window closes and the URL is displayed.</li>
    </ul>
    <p class="warning">
        If you have a subdomain, replace the 'demo' subdomain in the iframe source URL with yours.
    </p>

    <input type="button" value="Open Ready Player Me" onClick="displayIframe()" />
    <p id="avatarUrl">Avatar URL:</p>

    <iframe id="frame" class="frame" allow="camera *; microphone *; clipboard-write" hidden></iframe>
</>
);
};

export default AvatarPage;
