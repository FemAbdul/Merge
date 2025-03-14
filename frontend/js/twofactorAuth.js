async function display2FASetup() {
    const content = document.getElementById('content');
    
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
                            <!-- QR code will be inserted here -->
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
                                       pattern="[0-9]{6}"
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

    // Remove existing modal if present
    const existingModal = document.getElementById('twoFAModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add new modal
    content.insertAdjacentHTML('beforeend', form);

    // Request QR code from backend
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    };
    try{
        const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/generate-2fa-qr/', option);
    
        const qrCodeContainer = document.getElementById('qrCode');

        if (response.ok) {
            const data = await response.json();
            qrCodeContainer.innerHTML = `
                <img src="${data.qr_code}" alt="2FA QR Code" class="img-fluid">
                <p class="mt-2 text-muted">Backup code: ${data.secret_key}</p>
            `;
        } else {
            console.error('Failed to load QR code:', response.status, response.statusText);
            qrCodeContainer.innerHTML = `
                <div class="alert alert-danger">Failed to load QR code. Please try again.</div>
            `;
        }
    } catch (error) {
    console.error('Error:', error);
    document.getElementById('qrCode').innerHTML = `
        <div class="alert alert-danger">Failed to load QR code. Please try again.</div>
    `;
    }
    // Setup verification form submission
    document.getElementById('verificationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = document.getElementById('verificationCode').value;

        try {
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    code: code
                })
            };
            const response = await apiCallWithAutoRefresh('http://127.0.0.1:8000/verify-2fa/', option);

            const data = await response.json();
            if (data.success) {
                alert('2FA has been successfully enabled!');
                closeModal();
            } else {
                alert('Invalid code. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Verification failed. Please try again.');
        }
    });
}

function closeModal() {
    const modal = document.getElementById('twoFAModal');
    if (modal) {
        modal.remove();
    }
}