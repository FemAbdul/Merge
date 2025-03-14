async function display2FASetup() {
    const content = document.getElementById('content');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Modal HTML structure
    const form = `
        <div class="modal" id="twoFAModal" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Enable 2FA Authentication</h5>
                        <button type="button" class="close" onclick="closeModal()">&times;</button>
                    </div>
                    <div class="modal-body text-center">
                        <p>1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
                        <div id="qrCode" class="my-3">
                            <!-- QR code placeholder with loading spinner -->
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <p>2. Enter the 6-digit code from your authenticator app to verify:</p>
                        <form id="verificationForm">
                            <div class="form-group">
                                <input type="text"
                                       class="form-control text-center"
                                       id="verificationCode"
                                       maxlength="6"
                                       pattern="\\d{6}"
                                       placeholder="Enter 6-digit code"
                                       required>
                            </div>
                            <button type="submit" class="btn btn-primary mt-3">Verify and Enable 2FA</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove any existing modal
    document.getElementById('twoFAModal')?.remove();

    // Insert new modal
    content.insertAdjacentHTML('beforeend', form);

    // Request QR code from backend
    try {
        const option = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.token}`,
            },
        };
console.log(currentUser);
        const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/generate2fa/', option);
        const qrCodeContainer = document.getElementById('qrCode');

        if (response.ok) {
            // Create a URL object from the response's blob data
            const data = await response.blob();
            const qrCodeUrl = URL.createObjectURL(data);

            // Insert the image into the DOM
            qrCodeContainer.innerHTML = `
                <img src="${qrCodeUrl}" alt="2FA QR Code" class="img-fluid">
            `;
        } else {
            qrCodeContainer.innerHTML = `
                <div class="alert alert-danger">Failed to load QR code. Please try again later.</div>
            `;
            console.error('QR Code Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('QR Code Fetch Error:', error);
        document.getElementById('qrCode').innerHTML = `
            <div class="alert alert-danger">Failed to load QR code. Please check your connection.</div>
        `;
}

    // Handle verification form submission
    document.getElementById('verificationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = document.getElementById('verificationCode').value.trim();

        if (!/^\d{6}$/.test(code)) {
            alert('Please enter a valid 6-digit code.');
            return;
        }

        try {
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify({ 
                    username:currentUser.username,
                    otp_code:code }),
            };

            const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/verifyotp/', option);

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('✅ 2FA has been successfully enabled!');
                    closeModal();
                } else {
                    alert('❌ Invalid code. Please try again.');
                }
            } else {
                console.error('Verification Error:', response.status, response.statusText);
                alert('⚠️ Verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Verification Fetch Error:', error);
            alert('⚠️ An error occurred during verification. Please try again later.');
        }
    });
}

// Close the 2FA modal
function closeModal() {
    document.getElementById('twoFAModal')?.remove();
}