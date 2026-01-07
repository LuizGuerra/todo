//
//  ViewController.swift
//  To-Do Lite
//
//  Created by Luiz Pedro Franciscatto Guerra on 2024-02-26.
//

import UIKit
import WebKit

final class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {

    @IBOutlet weak var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        webView.uiDelegate = self
        webView.navigationDelegate = self

        loadLocalSite()
    }

    private func loadLocalSite() {
        guard let indexURL = Bundle.main.url(forResource: "index", withExtension: "html") else {
            fatalError("Missing index.html in app bundle")
        }

        // Allow loading style.css/app.js/assets from the same folder
        let folderURL = indexURL.deletingLastPathComponent()
        webView.loadFileURL(indexURL, allowingReadAccessTo: folderURL)
    }
    
    private func loadWebSite() {
        let url = URL(string: "https://luizguerra.github.io/todo/")!
        
        webView.uiDelegate = self
        webView.load(URLRequest(url: url))
        webView.allowsBackForwardNavigationGestures = true
    }
}


