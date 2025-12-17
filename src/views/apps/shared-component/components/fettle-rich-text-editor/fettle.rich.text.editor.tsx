import React from 'react'

import { addClass, Browser, createElement, removeClass } from '@syncfusion/ej2-base'
import {
  Count,
  FileManager,
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Table,
  Toolbar
} from '@syncfusion/ej2-react-richtexteditor'
import CodeMirror from 'codemirror'

import 'codemirror/mode/css/css.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/javascript/javascript'

import './index.css'
import './material-rte.css'
import { SampleBase } from './sample.base'

 class FettleRichTextEditor extends SampleBase {
  hostUrl: string
  items: string[]
  fileManagerSettings: {
    enable: boolean
    path: string
    ajaxSettings: { url: string; getImageUrl: string; uploadUrl: string; downloadUrl: string }
  }
  quickToolbarSettings: { table: string[] }
  editArea: any
  rteObj: any
  textArea: any
  toolbarSettings: { items: string[] }
  myCodeMirror: any
  constructor(props:any) {
    super(props)
    this.state = {
      formatName: '',
      body: '',
      isClient: false
    }
    const { data } = this.props

    this.hostUrl = 'https://ej2-aspcore-service.azurewebsites.net/'

    // Rich Text Editor items list
    this.items = [
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontName',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      'LowerCase',
      'UpperCase',
      '|',
      'Formats',
      'Alignments',
      'NumberFormatList',
      'BulletFormatList',
      'Outdent',
      'Indent',
      'SuperScript',
      'SubScript',
      '|',
      'CreateTable',
      'CreateLink',
      'Image',
      'FileManager',
      '|',
      'ClearFormat',
      'Print',
      'SourceCode',
      'FullScreen',
      '|',
      'Undo',
      'Redo'
    ]
    this.fileManagerSettings = {
      enable: true,
      path: '/Pictures/Food',
      ajaxSettings: {
        url: this.hostUrl + 'api/FileManager/FileOperations',
        getImageUrl: this.hostUrl + 'api/FileManager/GetImage',
        uploadUrl: this.hostUrl + 'api/FileManager/Upload',
        downloadUrl: this.hostUrl + 'api/FileManager/Download'
      }
    }
    this.quickToolbarSettings = {
      table: [
        'TableHeader',
        'TableRows',
        'TableColumns',
        'TableCell',
        '-',
        'BackgroundColor',
        'TableRemove',
        'TableCellVerticalAlign',
        'Styles'
      ]
    }

    //Rich Text Editor ToolbarSettings
    this.toolbarSettings = {
      items: this.items
    }

    this.dropHandler = this.dropHandler.bind(this)
  }

  onCreated(args: any) {
    this.editArea = this.rteObj.inputElement
    this.editArea.addEventListener('drop', this.dropHandler)
    this.editArea.addEventListener('dragover', this.dragoverHandler)
  }

  mirrorConversion(e: any) {
    this.textArea = this.rteObj.contentModule.getEditPanel()
    const id = this.rteObj.getID() + 'mirror-view'
    let mirrorView = this.rteObj.element.querySelector('#' + id)
    const charCount = this.rteObj.element.querySelector('.e-rte-character-count')

    if (e.targetItem === 'Preview') {
      this.textArea.style.display = 'block'
      mirrorView.style.display = 'none'
      this.textArea.innerHTML = this.myCodeMirror.getValue()
      charCount.style.display = 'block'
    } else {
      if (!mirrorView) {
        mirrorView = createElement('div', { className: 'e-content' })
        mirrorView.id = id
        this.textArea.parentNode.appendChild(mirrorView)
      } else {
        mirrorView.innerHTML = ''
      }

      this.textArea.style.display = 'none'
      mirrorView.style.display = 'block'
      this.renderCodeMirror(mirrorView, this.rteObj.value)
      charCount.style.display = 'none'
    }
  }
  renderCodeMirror(mirrorView: any, content: any) {
    this.myCodeMirror = CodeMirror(mirrorView, {
      value: content,
      lineNumbers: true,
      mode: 'text/html',
      lineWrapping: true
    })
    
  }
  componentDidMount() {
    this.setState({ isClient: true }) // Mark as client-side
  }
  handleFullScreen(e:any) {
   if(this.state.isClient){
    const sbCntEle:any = document.querySelector('.sb-content.e-view')
    const sbHdrEle:any = document.querySelector('.sb-header.e-view')
    let leftBar:any;
    let transformElement:any;

    if (Browser.isDevice) {
      leftBar = document.querySelector('#right-sidebar')
      transformElement = document.querySelector('.sample-browser.e-view.e-content-animation')
    } else {
      leftBar = document.querySelector('#left-sidebar')
      transformElement = document.querySelector('#right-pane')
    }

    if (e.targetItem === 'Maximize') {
      if (Browser.isDevice && Browser.isIos) {
        addClass([sbCntEle, sbHdrEle], ['hide-header'])
      }

      addClass([leftBar], ['e-close'])
      removeClass([leftBar], ['e-open'])

      if (!Browser.isDevice) {
        transformElement.style.marginLeft = '0px'
      }

      transformElement.style.transform = 'inherit'
    } else if (e.targetItem === 'Minimize') {
      if (Browser.isDevice && Browser.isIos) {
        removeClass([sbCntEle, sbHdrEle], ['hide-header'])
      }

      removeClass([leftBar], ['e-close'])

      if (!Browser.isDevice) {
        addClass([leftBar], ['e-open'])
        transformElement.style.marginLeft = leftBar.offsetWidth + 'px'
      }

      transformElement.style.transform = 'translateX(0px)'
    }
   }
  }
  actionCompleteHandler(e:any) {
    if (e.targetItem && (e.targetItem === 'SourceCode' || e.targetItem === 'Preview')) {
      this.rteObj.sourceCodeModule.getPanel().style.display = 'none'
      this.mirrorConversion(e)
    } else {
      setTimeout(() => {
        this.rteObj.toolbarModule.refreshToolbarOverflow()
      }, 400)
    }
  }
  handleChange() {
    this.props.setEditorContent(<p>{this.rteObj.value}</p>)
    Object.prototype.toString.call(this.props.onChange) == '[object Function]' && this.props.onChange(this.rteObj.value)
  }

  dropHandler(args:any) {
    args.preventDefault()
    this.rteObj.executeCommand('insertHTML', args.dataTransfer.getData('text'))
    Object.prototype.toString.call(this.props.onChange) == '[object Function]' &&
      this.props.onChange(this.rteObj.inputElement.innerHTML)
  }
  dragoverHandler(args:any) {
    args.preventDefault()
  }
  onstart(args:any) {
    args.dataTransfer.setData('text', args.target.innerText)
  }

  componentDidUpdate(prevProps:any) {
    if (this.props.data !== prevProps.data) {
      this.setState({
        body: this.props.data?.props?.children || ''
      })
    }
  }

  render() {
    const content = <p>{new String(this.state.body)}</p>

    
return (
      <div className='control-pane'>
        <div className='control-section' id='rteTools'>
          <div className='rte-control-section'>
            <RichTextEditorComponent
              id='toolsRTE'
              ref={(richtexteditor:any) => {
                this.rteObj = richtexteditor
              }}
              showCharCount={true}
              actionBegin={this.handleFullScreen.bind(this)}
              actionComplete={this.actionCompleteHandler.bind(this)}
              maxLength={2000}
              toolbarSettings={this.toolbarSettings}
              fileManagerSettings={this.fileManagerSettings}
              quickToolbarSettings={this.quickToolbarSettings}
              change={this.handleChange.bind(this)}
              created={this.onCreated.bind(this)}
              value={this.state.body}
            >
              <Inject services={[Toolbar, Image, Link, HtmlEditor, Count, QuickToolbar, Table, FileManager]} />
              {/* {content} */}
              {/* {String(this.state.body)} */}
            </RichTextEditorComponent>
          </div>
        </div>
      </div>
    )
  }
}
export default FettleRichTextEditor;
