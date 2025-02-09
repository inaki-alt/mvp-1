import React from 'react'

const EmailFooter = () => {
    return (
        <div className="p-4 bg-white d-flex align-items-center justify-content-center">
            <div className="hstack gap-2 fs-11">
                <a href="#">Terms</a>
                <span className="wd-3 ht-3 bg-gray-500 rounded-circle" />
                <a href="#">Privacy</a>
                <span className="wd-3 ht-3 bg-gray-500 rounded-circle" />
                <a href="#">Policies</a>
            </div>
        </div>
    )
}

export default EmailFooter