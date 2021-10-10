"use strict";
!function(e) {
    !function(e) {
        var t = function() {
            function t(e, t, n, o, i) {
                this.blocked = e,
                this.userId = t,
                this.ownerId = n,
                this.signupUrl = o,
                this.resources = i,
                this.eventNamespace = "quota-playback-modal",
                this._onToggle = new PanoptoCore.TypedCallback
            }
            return Object.defineProperty(t.prototype, "onToggle", {
                get: function() {
                    return this._onToggle
                },
                enumerable: !1,
                configurable: !0
            }),
            t.prototype.render = function() {
                var e = this;
                this.wrapper = $(t.template(this)),
                this.modal = this.wrapper.find(".quota-playback-modal"),
                this.wrapper.click((function() {
                    e.blocked || e.hide()
                }
                )),
                this.modal.click((function(e) {
                    e.stopPropagation()
                }
                )),
                this.wrapper.hide(),
                $(window).resize((function() {
                    e.modal.is(":visible") && e.resize()
                }
                ))
            }
            ,
            t.prototype.show = function() {
                var t, n = this;
                if (this.userId)
                    t = this.userId === this.ownerId ? new e.QuotaPlaybackModalDialogs.OwnerDialog(this.resources) : new e.QuotaPlaybackModalDialogs.ViewerDialog(this.resources);
                else {
                    var o = new e.QuotaPlaybackModalDialogs.AnonymousUserDialog(this.blocked,this.signupUrl,this.resources);
                    o.onDismiss.add((function() {
                        n.hide()
                    }
                    )),
                    t = o
                }
                t.render(),
                this.modal.contents().replaceWith(t.getElement()),
                this.wrapper.show(),
                this.resize(),
                $(window).on("resize." + this.eventNamespace, (function() {
                    n.resize()
                }
                )),
                this._onToggle.fire(!0)
            }
            ,
            t.prototype.hide = function() {
                this.wrapper.hide(),
                $(window).off("resize." + this.eventNamespace),
                this._onToggle.fire(!1)
            }
            ,
            t.prototype.fadeIn = function() {
                this.show(),
                this.wrapper.hide(),
                this.wrapper.fadeIn()
            }
            ,
            t.prototype.getElement = function() {
                return this.wrapper
            }
            ,
            t.prototype.resize = function() {
                this.modal.height(this.modal.find(".quota-dialog").height());
                var e = window.innerWidth / this.modal.find(".quota-dialog").width()
                  , t = window.innerHeight / this.modal.height()
                  , n = Math.min(e, t);
                this.modal.css({
                    transform: "scale(" + Math.min(1, n) + ") translate(-50%, -50%)"
                })
            }
            ,
            t.template = _.template("\n            <div class='quota-playback-modal-wrapper'>\n                <div class='quota-playback-modal'>\n                </div>\n            </div>\n        "),
            t
        }();
        e.QuotaPlaybackModal = t
    }(e.Controls || (e.Controls = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        var t = function() {
            function t(e, n, o, i, a, r, s) {
                this.cookieService = e,
                this.container = n,
                this.resources = o,
                this.deliveryId = i,
                this.ownerId = a,
                this.userId = r,
                this.signupUrl = s,
                this.secondsListened = 0,
                this._onToggle = new PanoptoCore.TypedCallback,
                this.quotaBlockedCookieName = t.quotaBlockedCookiePrefix + this.deliveryId
            }
            return Object.defineProperty(t.prototype, "onToggle", {
                get: function() {
                    return this._onToggle
                },
                enumerable: !1,
                configurable: !0
            }),
            t.prototype.initialize = function(n) {
                var o = this;
                this.overQuota = n,
                this.overQuota || this.setBlockedCookie(!1),
                this.blocked = this.getBlockedCookie(),
                this.overQuota && (this.availableSeconds = this.blocked ? 0 : t.playbackTeaseDuration),
                this.modal = new e.QuotaPlaybackModal(this.blocked,this.userId,this.ownerId,this.signupUrl,this.resources),
                this.modal.onToggle.add((function(e) {
                    o._onToggle.fire(e)
                }
                )),
                this.modal.render(),
                this.container.append(this.modal.getElement()),
                window.setTimeout((function() {
                    window.location.reload()
                }
                ), 864e5),
                this.blocked && this.modal.show()
            }
            ,
            t.prototype.update = function(e) {
                if (!this.userId && !this.overQuota && 0 === this.secondsListened && e) {
                    var n = parseInt(this.cookieService.getCookie(t.signupViewedCookieName), 10) || 0;
                    n % t.signupShowInterval == t.signupShowInterval - 1 && this.modal.show(),
                    this.cookieService.setCookie(t.signupViewedCookieName, n + 1)
                }
                this.secondsListened += e,
                this.blocked = void 0 !== this.availableSeconds && this.secondsListened >= this.availableSeconds,
                this.blocked && (this.modal.blocked = this.blocked,
                this.modal.show(),
                this.setBlockedCookie(!0))
            }
            ,
            t.prototype.fadeInModalForAnonymous = function() {
                this.userId || this.modal.fadeIn()
            }
            ,
            t.prototype.setBlockedCookie = function(e) {
                e ? this.cookieService.setCookie(this.quotaBlockedCookieName, e) : this.cookieService.deleteCookie(this.quotaBlockedCookieName)
            }
            ,
            t.prototype.getBlockedCookie = function() {
                return "true" === this.cookieService.getCookie(this.quotaBlockedCookieName)
            }
            ,
            t.playbackTeaseDuration = 30,
            t.quotaBlockedCookiePrefix = "quotaBlocked",
            t.signupViewedCookieName = "signupViewed",
            t.signupShowInterval = 5,
            t
        }();
        e.QuotaPlaybackTracker = t
    }(e.Controls || (e.Controls = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function t(t, n, o, i) {
                    this.target = t,
                    this.overlayUploader = n,
                    this.onCloseClick = o,
                    this.resources = i,
                    this.errorMessageDuration = 3e3,
                    this.errorFiles = [],
                    this.renderElement(),
                    this.target.append(this.element),
                    this.closeButton = this.element.find(".close-button"),
                    Panopto.Core.UI.Handlers.button(this.closeButton, this.onCloseClick),
                    this.processingStatus = this.element.find(".processing-status"),
                    this.fileProcessingRegion = new e.FileProcessingRegion(this.processingStatus,this.resources),
                    this.hide()
                }
                return t.prototype.show = function(e) {
                    this.element.show(),
                    this.closeButton.toggle(e)
                }
                ,
                t.prototype.hide = function() {
                    this.element.hide()
                }
                ,
                t.prototype.toggleProcessingStatus = function(e) {
                    var t = this;
                    if (e.length) {
                        if (this.fileProcessingRegion.render(e),
                        this.processingStatus.show(),
                        _.some(e.filter((function(e) {
                            return -1 == t.errorFiles.indexOf(e.uploadId)
                        }
                        )), (function(e) {
                            return 1 !== e.state && 2 !== e.state
                        }
                        ))) {
                            var n = Panopto.cacheRoot + "/Images/upload_error.svg"
                              , o = _.find(e.reverse(), (function(e) {
                                return 1 !== e.state && 2 !== e.state
                            }
                            ));
                            if (this.errorFiles.push(o.uploadId),
                            1 === o.streamType) {
                                var i = this.element.find(".primary-stream-text")
                                  , a = this.element.find(".primary-stream-graphic");
                                i.text(Panopto.GlobalResources.ViewerPlus_Overlay_InvalidFiletype.format(o.filename)),
                                a.attr("src", n),
                                setTimeout((function() {
                                    i.text(Panopto.GlobalResources.ViewerPlus_PrimaryOverlay_Subtitle),
                                    a.attr("src", Panopto.cacheRoot + "/Images/upload_primary_stream_large.svg")
                                }
                                ), this.errorMessageDuration)
                            } else {
                                var r = this.element.find(".secondary-stream-text")
                                  , s = this.element.find(".secondary-stream-graphic");
                                r.text(Panopto.GlobalResources.ViewerPlus_Overlay_InvalidFiletype.format(o.filename)),
                                s.attr("src", n),
                                setTimeout((function() {
                                    r.text(Panopto.GlobalResources.ViewerPlus_SecondaryOverlay_Subtitle),
                                    s.attr("src", Panopto.cacheRoot + "/Images/upload_secondary_stream.svg")
                                }
                                ), this.errorMessageDuration)
                            }
                        }
                    } else
                        this.processingStatus.hide()
                }
                ,
                t
            }();
            e.AddStreamOverlay = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Analytics = function(e) {
    return e.Actions = {
        Navigate: "navigate",
        PrimaryResize: "primary-resize",
        SecondaryResize: "secondary-resize",
        Transport: "transport",
        HideThumbnails: "hide-thumbnails",
        ShowThumbnails: "show-thumbnails",
        VolumeUp: "volume-up",
        VolumeDown: "volume-down",
        Mute: "mute",
        Unmute: "unmute",
        Play: "play",
        Pause: "pause",
        Rewind: "rewind",
        SkipToStart: "skip-to-start",
        Forward: "forward",
        SkipToEnd: "skip-to-end",
        Seek: "seek",
        Prereq: "prereq",
        Exit: "exit",
        Add: {
            Success: "add-event",
            Error: "add-error",
            Retry: "add-retry",
            Cancel: "add-cancel"
        },
        Edit: {
            Success: "edit-event",
            Error: "edit-error",
            Retry: "edit-retry",
            Cancel: "edit-cancel"
        },
        Delete: {
            Success: "delete-event",
            Error: "delete-error",
            Retry: "delete-retry",
            Cancel: "delete-cancel"
        },
        Speed: "speed",
        Bitrate: "bitrate",
        SecondaryTab: "secondary-tab",
        Quality: "quality",
        Desync: "multi-stream-desync"
    },
    e.Labels = {
        Thumbnail: "thumbnail",
        Transcript: "caption",
        Attachment: "attachment",
        Content: "chapter",
        Search: "search",
        Normal: "normal",
        Fullscreen: "fullscreen",
        Hotkey: "hotkey",
        Login: "login",
        Folder: "folder",
        DoubleClick: "double-click",
        Forward: "forward",
        Note: "note",
        Bookmark: "bookmark",
        Comment: "comment",
        Question: "question",
        Access: "access",
        SessionList: "session-list",
        Settings: "settings",
        Share: "share",
        Editor: "editor",
        EditContents: "edit-contents",
        EditTranscript: "edit-transcript",
        EditSlides: "edit-slides",
        EditCut: "edit-cut",
        EditStream: "edit-stream",
        EditQuestionList: "edit-question-list",
        PrimaryAhead: "primary-ahead",
        SecondaryAhead: "secondary-ahead",
        OndemandAutoLevel: "onedmand-auto",
        OndemandManualLevel: "ondemand-manual",
        BroadcastAutoLevel: "broadcast-auto",
        BroadcastManualLevel: "broadcast-manual"
    },
    e.sendEvent = function(e) {
        Panopto.GoogleAnalytics.sendEvent({
            productId: Panopto.viewer.GAEventProductId.behavior,
            source: "player",
            action: e.action,
            label: e.label
        })
    }
    ,
    e.sendFullScreenEvent = function(t, n) {
        e.sendEvent({
            action: t ? e.Actions.PrimaryResize : e.Actions.SecondaryResize,
            label: n ? e.Labels.DoubleClick : e.Labels.Normal
        })
    }
    ,
    e.sendDesyncEvent = function(t) {
        Panopto.GoogleAnalytics.sendEvent({
            productId: Panopto.viewer.GAEventProductId.sync,
            source: "player",
            action: e.Actions.Desync,
            label: t.diff > 0 ? e.Labels.PrimaryAhead : e.Labels.SecondaryAhead,
            value: Math.round(1e3 * Math.abs(t.diff)),
            customFields: {
                dimension1: Panopto.webServerFQDN,
                dimension2: t.deliveryId,
                dimension3: t.invocationId
            }
        })
    }
    ,
    e.QualityReporter = function(t) {
        var n, o, i, a, r, s, l, d, c = !1, u = 0, p = !t.isAudioOnly;
        return (l = (t.isBroadcast ? new RegExp("Sessions/(?:(?:_hlsbc)|(?:_rtmp))/([a-z0-9-]{36})/master.m3u8\\??(.*)","i") : new RegExp("Sessions/[a-z0-9-]{36}/([a-z0-9-]{36}(?:-[a-z0-9-]{36})?)..*hls/master.m3u8\\??(.*)","i")).exec(t.streamUrl)) && l.length ? (l.length >= 2 && (n = l[1]),
        l.length >= 3 && (d = new RegExp("InvocationID=([a-z0-9-]{36})","i").exec(l[2]),
        o = d && 2 === d.length ? d[1] : "")) : p = !1,
        {
            flushQualityReport: function(l, d, f, h, m, v) {
                var y = d - u;
                p && c && y >= t.minDuration && Panopto.GoogleAnalytics.sendEvent({
                    productId: Panopto.viewer.GAEventProductId.quality,
                    source: "player",
                    action: e.Actions.Quality,
                    label: t.isBroadcast ? s ? e.Labels.BroadcastAutoLevel : e.Labels.BroadcastManualLevel : s ? e.Labels.OndemandAutoLevel : e.Labels.OndemandManualLevel,
                    customFields: {
                        dimension1: Panopto.webServerFQDN,
                        dimension2: n,
                        dimension3: o,
                        metric1: Math.round((i + 1) / a * 100 * y),
                        metric2: Math.round(r / 1024 * y),
                        metric3: Math.round(y)
                    }
                }),
                c = l,
                u = d,
                i = f,
                a = h,
                r = m,
                s = v
            }
        }
    }
    ,
    e
}(Panopto.Viewer.Analytics || {}),
(Panopto = Panopto || {}).Core = Panopto.Core || {},
Panopto.Viewer = Panopto.Viewer || {},
Panopto.GlobalResources = Panopto.GlobalResources || {},
function(e) {
    !function(e) {
        var t = function() {
            function e() {}
            return e.TimedSyncRate = 30,
            e.ControlSyncRate = 1e3,
            e.SecondarySyncThreshold = 1,
            e.SecondarySynchronizingUpdateRateMillis = 50,
            e.InitialSecondaryThreshold = 5,
            e.SecondaryStreamOffset = 1.5,
            e.MinSegmentGap = 1,
            e.ContiguousSegmentThreshold = .2,
            e.EndPositionThreshold = .1,
            e.DeliveryRefreshInterval = 6e4,
            e.DeliveryRefreshRetryCount = 5,
            e.BroadcastEndedIncrement = 5e3,
            e.ReopenedBroadcastInterval = 3e4,
            e.QualityReportThreshold = 2,
            e.BroadcastStreamRetryTimeout = 5e3,
            e.LivePositionTolerance = 1,
            e.BroadcastEndThreshold = 1,
            e.MaxPositionInterpolation = 500,
            e.BufferingTimeoutThreshold = 1e3,
            e.BadSeekThreshold = .1,
            e.NativePositionFallbackRegion = 1,
            e.CircularLogBufferSize = 2048,
            e.SecondaryContentClass = "secondary-content",
            e.SecondaryPlayerClass = "secondaryPlayer",
            e.SlideDeckId = "slideDeck",
            e.ScreenCaptureClass = "screen-capture",
            e.ObjectVideoTabClass = "object-video",
            e.UrlTabClass = "url",
            e.TocIconClass = "toc",
            e.YouTubeIconClass = "youtube",
            e.SmartChapterIconClass = "smart-chapter",
            e.SlideDeckTabClass = "slide-deck",
            e.PrimaryTabHeaderClass = "primary-header",
            e.SecondaryTabHeaderClass = "secondary-header",
            e.RecentBroadcastThreshold = 144e5,
            e.PlayKeyCode = 32,
            e.RewindKeyCode = 37,
            e.ForwardKeyCode = 39,
            e.VolumeUpKeyCode = 38,
            e.VolumeDownKeyCode = 40,
            e.MuteKeyCode = 77,
            e.VolumeIncrement = 10,
            e.PositionIncrement = 5,
            e.MinVolume = 0,
            e.MaxVolume = 100,
            e.InitialVolume = 100,
            e.SilverlightVersion = "4.0.50401.0",
            e.PlaySpeedSilverlightVersion = "5.0",
            e.QuickRewindSeconds = 10,
            e.QuickForwardSeconds = 30,
            e.FullScreenControlInterval = 3,
            e.EditJumpSeconds = 5,
            e.CaptionMaxLength = 384,
            e.TOCMaxLength = 200,
            e.EditorTimelineEndOffsetSeconds = .01,
            e.DisplayTimePrecisionMultiplier = Math.pow(10, Panopto.Core.Constants.DisplayTimeMillisecondPrecision),
            e.UrlEventClosenessTolerance = .1,
            e.BoundaryCutTolerance = .1,
            e.StreamDeleteCutTolerance = .01,
            e.LeftPaneRatio = .35,
            e.LeftPaneMinWidth = 460,
            e.RightPaneMinWidth = 480,
            e.HeaderBuffer = 60,
            e.MaxDesktopTitleCharacters = 120,
            e.MaxMobileTitleCharacters = 60,
            e.EventRegionMinHeight = 300,
            e.PlayerMinHeight = 50,
            e.LeftPlayerDefaultHeight = 260,
            e.LiveNotesClass = "live-notes",
            e.MaxInlineSecondaryTabs = 3,
            e.CollapseSecondaryTabsWidth = 1200,
            e.SliderDragThreshold = 2,
            e.InputMargin = 14,
            e.InputOptionsMargin = 4,
            e.ScrollBarWidth = 20,
            e.AudioOnlyMinimumWidth = 2,
            e.ThumbnailScrollTimeout = 5e3,
            e.EventScrollTimeout = 5e3,
            e.FlyoutTimeout = 2e3,
            e.MissingSeekedEventTimeout = 5e3,
            e.BaseUrl = Panopto.uriScheme + "://" + Panopto.webServerFQDN + Panopto.appRoot,
            e.SessionListUrl = e.BaseUrl + "/Pages/Sessions/List.aspx",
            e.SilverlightEditorUrlTemplate = e.BaseUrl + "/Pages/Editor/Default.aspx#{0}",
            e.SlideImageUrl = e.BaseUrl + "/Pages/Viewer/Image.aspx",
            e.ThumbUrl = e.BaseUrl + "/Pages/Viewer/Thumb.aspx",
            e.DummyPDFUrl = e.BaseUrl + "/Scripts/PluginDetect/empty.pdf",
            e.FlashPlayerUrl = "https://get.adobe.com/flashplayer",
            e.SinglePageAppUrl = Panopto.uriScheme + "://" + Panopto.webServerFQDN + Panopto.relativeSinglePageAppUrl,
            e.QuizEditUrlTemplate = e.SinglePageAppUrl + "quiz-configure/{0}",
            e.YouTubeEditUrlTemplate = e.SinglePageAppUrl + "youtubeEmbed/configure/{0}",
            e.HlsLevelFileNames = ["index.m3u8", "index2.m3u8"],
            e.JoinChannelOptionValue = "joinChannel",
            e.SearchExpandDuration = 400,
            e.FadeInterval = 150,
            e.PlaySpeedResourceString = "ViewerPlus_Speeds_{0}",
            e.BitrateResourcePrefixString = "ViewerPlus_Bitrates_",
            e.BitrateResourceString = e.BitrateResourcePrefixString + "{0}",
            e.SearchTypeResourceString = "ViewerPlus_Search_{0}",
            e.BitrateCookie = "defaultBitrate",
            e.MBRBitrateCookie = "defaultBitrateMBR",
            e.VolumeCookie = "defaultVolume",
            e.CaptionsCookie = "defaultCaptions",
            e.CaptionPlacementCookie = "defaultCaptionPlacement",
            e.CaptionSizeCookie = "defaultCaptionSize",
            e.CaptionColorCookie = "defaultCaptionColor",
            e.BitrateLevels = [Panopto.GlobalResources[e.BitrateResourcePrefixString + "Low"], Panopto.GlobalResources[e.BitrateResourcePrefixString + "Medium"], Panopto.GlobalResources[e.BitrateResourcePrefixString + "Medium"], Panopto.GlobalResources[e.BitrateResourcePrefixString + "High"]],
            e.MaxScormSegments = 100,
            e.ScormCompleteThreshold = .9,
            e.ScormOffsetMultiplier = 5,
            e.ScormMaxUpdateDelay = 30,
            e.ScormTimeKey = "cmi.core.session_time",
            e.PluginDetectPDFReader = "PDFReader",
            e.SortRelevanceValue = "relevance",
            e.SortTimeValue = "time",
            e.SearchSortOrders = [{
                value: e.SortRelevanceValue,
                name: Panopto.GlobalResources.ViewerPlus_SortByRelevance
            }, {
                value: e.SortTimeValue,
                name: Panopto.GlobalResources.ViewerPlus_SortByTime
            }],
            e.MP4MimeType = "video/mp4",
            e.HLSMimeType = "application/x-mpegurl",
            e.Hive = "Hive",
            e.Kollective = "Kollective",
            e.KollectiveLongPollUrlBase = "/api/v1/longpoll?ts={0}&ktoken=",
            e.LTIPage = "/Panopto/LTI/LTI.aspx",
            e.OutcomeFormat = "resultScore={0}&lis_result_sourcedid={1}&oauth_consumer_key={2}&lis_outcome_service_url={3}&lti_message_type=panopto_outcome_pox_response&lti_version=LTI-1p0",
            e
        }();
        e.Constants = t,
        function(e) {
            e[e.High = 2] = "High",
            e[e.Medium = 1] = "Medium",
            e[e.Auto = 0] = "Auto"
        }(e.MBRBitrate || (e.MBRBitrate = {})),
        function(e) {
            e[e.Primary = 1] = "Primary",
            e[e.Secondary = 2] = "Secondary",
            e[e.LiveNotes = 3] = "LiveNotes"
        }(e.ViewMode || (e.ViewMode = {}));
        var n = function() {
            function e() {}
            return e.getValues = function(e) {
                return Object.keys(e).map((function(t) {
                    return e[t]
                }
                )).filter((function(e) {
                    return !isNaN(e)
                }
                ))
            }
            ,
            e.getNames = function(e) {
                return Object.keys(e).map((function(t) {
                    return e[t]
                }
                )).filter((function(e) {
                    return isNaN(e)
                }
                )).map((function(e) {
                    return e.toString()
                }
                ))
            }
            ,
            e.getNameValuePairs = function(e) {
                return Object.keys(e).map((function(t) {
                    return new PanoptoCore.Models.KeyValue(t,e[t])
                }
                )).filter((function(e) {
                    return !isNaN(e.value)
                }
                ))
            }
            ,
            e
        }();
        e.EnumHelpers = n,
        function(e) {
            e.HttpHeaders = {
                Date: "date",
                LastModified: "last-modified"
            }
        }(t = e.Constants || (e.Constants = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
Panopto.Core.ViewerPlayState = Panopto.Core.ViewerPlayState || {},
Panopto.Viewer.PlayState = function(e) {
    return e.Playing = Panopto.Core.ViewerPlayState.Playing,
    e.Paused = Panopto.Core.ViewerPlayState.Paused,
    e.Stopped = Panopto.Core.ViewerPlayState.Stopped,
    e.Buffering = Panopto.Core.ViewerPlayState.Buffering,
    e
}(Panopto.Viewer.PlayState || {}),
function(e) {
    !function(e) {
        Panopto.Core.StringHelpers.parseQueryString(window.location.hash.slice(1)).debug && (window.fireDebugEvent = function(e) {
            var t = new CustomEvent(e.typeArg(),{
                detail: e
            });
            document.dispatchEvent(t)
        }
        );
        var t = function() {};
        e.DebugEventModel = t
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        var t = function() {
            function e(e, t, n, o, i, a, r) {
                this.showHtmlEditorCallback = e,
                this.showPurgedDeliveryCallback = t,
                this.showSilverlightEditorCallback = n,
                this.showUnsupportedBrowserCallback = o,
                this.showSessionNotReadyCallback = i,
                this.showPendingTranscriptionCallback = a,
                this.showEditorProcessingCallback = r
            }
            return e.prototype.routeDelivery = function(e) {
                e.isReadyForEditing ? Panopto.Core.Browser.isIE8 || Panopto.Core.Browser.isIE9 ? this.showUnsupportedBrowserCallback() : !Panopto.viewer.editingEnabled || e.requiresAdvancedEditor ? this.showSilverlightEditorCallback() : e.isPurgedLegacyEncode ? this.showPurgedDeliveryCallback() : Panopto.viewer.hasEditedTranscriptionRequest ? this.showPendingTranscriptionCallback() : this.showHtmlEditorCallback() : e.rehydrationAvailable && Panopto.viewer.enableEditorProcessingPageDuringHydration ? this.showEditorProcessingCallback() : this.showSessionNotReadyCallback()
            }
            ,
            e
        }();
        e.EditorRouter = t
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
(PanoptoLegacy = Panopto).Viewer.Layout = function(e, t, n, o, i, a, r, s, l, d) {
    var c, u, p, f = PanoptoTS.Viewer.ViewMode, h = PanoptoTS.Viewer.Constants, m = $("#viewer"), v = $("#viewerContent"), y = $("#searchRegion"), P = $("#eventTabs"), g = $("#eventTabControl"), S = $("#eventsExpanderButton"), C = $("#playControls"), w = $("#thumbnailList"), b = $("#timelineContainer"), T = $("#inlineMessageLetterbox"), E = $("#inlineMessage"), V = $("#dockedCaption"), I = $("#dockedCaptionText"), k = $("#overlayCaption"), R = $("#playlistOverlay"), D = "", L = !1, x = !($.browser.msie && parseFloat($.browser.version) < 10 || l || d), O = !1, U = g.outerWidth(), M = h.LeftPaneMinWidth, A = function(o, i) {
        var a = n.getLeftPane();
        a.stop(),
        o ? i ? (a.width(M).css("max-width", M),
        O = !1) : a.animate({
            width: M,
            "max-width": M
        }, {
            duration: 2 * h.FadeInterval,
            progress: function() {
                e.resize()
            },
            complete: function() {
                O = !1
            }
        }) : (O = !0,
        i ? a.width(U).css("max-width", U + "px") : a.animate({
            width: U,
            "max-width": U
        }, {
            step: function() {
                e.resize()
            }
        })),
        S.find("div").text(o ? Panopto.GlobalResources.ViewerPlus_HideEventTabs : Panopto.GlobalResources.ViewerPlus_ShowEventTabs).attr("aria-expanded", o),
        y.toggleClass("collapsed", !o),
        t.viewer.setState({
            eventPaneIsExpanded: o
        })
    }, H = function(e, t) {
        var n = T.is(":visible");
        T.width(e).height(t).show(),
        E.css("margin-top", (t - E.height()) / 2),
        n || T.hide()
    }, B = function() {
        var e = $(n.getSecondaryPlayers()[o.getPrimaryPlayerIndex()])
          , t = n.getRightPlayerContainer().offset();
        n.getPrimaryPlayer().css("left", t.left + "px").css("top", t.top + "px");
        var i = n.getLeftPlayerContainer().offset();
        e.css("left", i.left + "px").css("top", i.top + "px")
    }, F = function(e) {
        var t = o.getPrimaryPlayerIndex();
        if (t !== o.PrimaryDefaultIndex && e === PanoptoTS.Viewer.ViewMode.Secondary) {
            var i = n.getPrimaryPlayer()
              , a = $(n.getSecondaryPlayers()[t]);
            B(),
            i.addClass("roaming"),
            a.addClass("roaming")
        } else
            n.getPrimaryPlayer().add(n.getSecondaryPlayers()[t]).removeClass("roaming").css("left", "").css("top", ""),
            n.getSecondaryPlayers().removeClass("roaming").css("left", "").css("top", "")
    };
    $("#wrapper").css("min-width", "0px"),
    $("body").css("overflow", "hidden"),
    $("#logoutWarningMessage").addClass("bottom"),
    $.browser.msie && 8 === parseFloat($.browser.version) && (C.find("#transportControls").css("table-layout", "fixed"),
    C.find("#positionControl").css("width", "100%")),
    $(window).resize((function() {
        e.resize()
    }
    ));
    var N = "clicked";
    $(document).on("mousedown", "a", (function(e) {
        $(e.currentTarget).addClass(N)
    }
    )).on("blur", "a", (function(e) {
        $(e.currentTarget).removeClass(N)
    }
    )),
    x && (S.show(),
    Panopto.Core.UI.Handlers.button(S.find("div"), (function() {
        A(O, void 0)
    }
    ))),
    e.resize = function() {
        var i, l, u, p, g, S = n.getLeftPane(), T = (o.getLeftPlayerElement(),
        o.getLeftPlayer()), E = n.getLeftPlayerContainer(), I = n.getRightPlayerContainer(), k = b.is(":visible") && b.hasClass(Panopto.Core.Constants.ExpandedClass), D = $(window).height() - s.height() - (k ? b.outerHeight() : 0), L = $(window).width(), x = S.outerWidth() - S.width(), M = y.is(":visible") ? y.outerHeight(!0) : 0, A = (b.is(":visible") && !k ? b.outerHeight() : 0) + (V.is(":visible") ? V.outerHeight() : 0) + (w.is(":visible") ? w.outerHeight() : 0), F = Math.max(D - C.outerHeight() - A, h.PlayerMinHeight), N = I.outerWidth() - I.width(), z = I.outerHeight() - I.height();
        switch (v.height(D),
        b.css("top", k ? $(window).height() - b.outerHeight() + "px" : ""),
        c) {
        case f.Primary:
            l = h.LeftPaneMinWidth,
            i = O ? parseInt(S.css("max-width").slice(0, -2)) : l,
            p = Math.max(L - i - x, h.RightPaneMinWidth),
            S.width(i),
            g = Math.max(D, h.EventRegionMinHeight) - M,
            P.height(g),
            t.viewer.setState({
                eventPaneSize: {
                    width: i - U,
                    height: g
                }
            }),
            R.width(l),
            R.height(D),
            s.setLeftPaneWidth(l),
            T.resize(p, F),
            I.width(p),
            I.height(F),
            E.height(0),
            H(p, F),
            $("#copyrightNoticeContainer").height(D),
            m.css("min-width", i + x + h.RightPaneMinWidth),
            d && d.resize(k ? i + x + p : p),
            w.width(p),
            e.toggleInlineSecondaries(),
            e.resizeCaption();
            break;
        case f.Secondary:
            l = r.isPrimaryAudioOnly || d ? h.LeftPaneMinWidth : Math.max(L * h.LeftPaneRatio, h.LeftPaneMinWidth),
            i = O ? parseInt(S.css("max-width").slice(0, -2)) : l,
            p = Math.max(L - i - x, h.RightPaneMinWidth),
            S.width(i).css("max-width", i),
            T && (D - (u = 0 === T.height() || 0 === T.width() || r.isPrimaryAudioOnly ? e.forceLeftPlayerHeight ? h.LeftPlayerDefaultHeight : 0 : i * T.height() / T.width()) >= h.EventRegionMinHeight ? (T.resize(i, u),
            E.width(i),
            E.height(u),
            g = D - u - M) : (T.resize(i, Math.max(D - h.EventRegionMinHeight, h.PlayerMinHeight)),
            E.width(i),
            E.height(Math.max(D - h.EventRegionMinHeight, h.PlayerMinHeight)),
            g = h.EventRegionMinHeight - M)),
            P.height(g),
            t.viewer.setState({
                eventPaneSize: {
                    width: i - U,
                    height: g
                }
            }),
            R.width(l),
            R.height(D),
            s.setLeftPaneWidth(i);
            var G, j, Q = p - N, q = F - z;
            1 === a.length ? (G = Q,
            j = q) : 4 === a.length ? (G = Q / 2,
            j = q / 2) : p > F ? (G = Q / a.length,
            j = q) : (G = Q,
            j = q / a.length),
            I.width(Q),
            I.height(q),
            _.each(o.getRightPlayers(), (function(e, t) {
                if (e) {
                    var i = 0
                      , a = 0;
                    if (t !== o.getPrimaryPlayerIndex()) {
                        var r = n.getSecondaryPlayers()[t].children[0];
                        $(r).css("border-left-width") && (i += parseFloat($(r).css("border-left-width"))),
                        $(r).css("border-right-width") && (i += parseFloat($(r).css("border-right-width"))),
                        $(r).css("border-top-width") && (a += parseFloat($(r).css("border-top-width"))),
                        $(r).css("border-bottom-width") && (a += parseFloat($(r).css("border-bottom-width")))
                    }
                    e.resize(G - i / 2, j - a / 2)
                }
            }
            )),
            o.getPrimaryPlayerIndex() != o.PrimaryDefaultIndex && B(),
            H(p, F),
            d && d.resize(k ? i + x + p : p),
            $("#copyrightNoticeContainer").height(j),
            w.width(p),
            e.toggleInlineSecondaries(),
            e.resizeCaption();
            break;
        case f.LiveNotes:
            i = h.LeftPaneMinWidth,
            S.width(i),
            t.viewer.setState({
                eventPaneSize: {
                    width: i - U,
                    height: D
                }
            }),
            R.width(0)
        }
        e.positionAutoplayMessage()
    }
    ;
    var z = function(t) {
        o.swapLeftAndRight(t),
        F(c),
        e.resize()
    }
      , G = function(e) {
        var t = o.getLeftPlayerElement()
          , i = o.getRightPlayerElements();
        switch (e) {
        case f.Primary:
            i.css("max-height", 0),
            t.css("max-height", ""),
            t.hasClass("primary-only") || t.addClass("primary-only"),
            x && (S.css("visibility", "visible"),
            !c || r.isPrimaryAudioOnly && O || A(!0, !0));
            break;
        case f.Secondary:
            t.css("max-height", ""),
            i.css("max-height", ""),
            r.isPrimaryAudioOnly || (O && A(!0, !0),
            n.getLeftPane().css("max-width", ""),
            S.css("visibility", "hidden")),
            t.removeClass("primary-only"),
            t.css("height", ""),
            t.css("width", ""),
            V.add(C).css("margin-top", ""),
            m.css("min-width", "");
            break;
        case f.LiveNotes:
            s.toggleLiveNotes(!0),
            t.hide(),
            C.hide(),
            g.hide(),
            n.getRightPane().hide()
        }
    };
    e.swapLeftToRight = function(t) {
        (e.isSecondarySwapAllowed() || o.getPrimaryPlayerIndex() !== o.PrimaryDefaultIndex && t === o.PrimaryDefaultIndex) && z(t)
    }
    ,
    e.swapPrimaryAndFirstSecondary = function() {
        e.swapLeftToRight(o.getPrimaryPlayerIndex() == o.PrimaryDefaultIndex ? 0 : o.PrimaryDefaultIndex)
    }
    ,
    e.interruptLayoutChanges = function(t) {
        a.length > 1 && ((t || e.viewMode()) === f.Secondary && (p = a.length,
        e.setSecondaryCount(1)));
        var n = o.getPrimaryPlayerIndex();
        n != o.PrimaryDefaultIndex && (void 0 !== t && o.setViewMode(t),
        u = n,
        z(o.PrimaryDefaultIndex))
    }
    ,
    e.restoreLayoutChanges = function() {
        if (void 0 !== p) {
            var t = p;
            p = void 0,
            e.setSecondaryCount(t)
        }
        var n = void 0 !== u;
        if (n) {
            var o = u;
            u = void 0,
            z(o)
        }
        return n
    }
    ,
    e.isSecondarySwapAllowed = function() {
        return e.viewMode() === f.Secondary && !r.isPrimaryAudioOnly && r.flowPlayerEnabled && !e.isFullscreen() && !d && void 0 === u && 1 === a.length && !_.any(a, (function(e) {
            return e.getTabControl() && e.getTabControl().selectedTab() && e.getTabControl().selectedTab().content().isSecondaryPaneOnly
        }
        ))
    }
    ,
    e.viewMode = function(n) {
        if (void 0 === n)
            return c;
        n !== c && (G(n),
        !c && x && (n !== f.Primary && !r.isPrimaryAudioOnly || t.viewer && t.viewer.props && t.viewer.props.initialSearchTerm || r.contents.length ? A(!0, !0) : A(!1, !0)),
        c = n,
        n === f.Primary && o.getPrimaryPlayerIndex() !== o.PrimaryDefaultIndex ? (e.interruptLayoutChanges(n),
        G(n)) : (o.setViewMode(n),
        n === f.Secondary && void 0 !== u ? (e.restoreLayoutChanges(),
        G(n)) : F(n)),
        e.resize())
    }
    ,
    e.toggleInlineSecondaries = function() {
        var e, t = $(window).width() < h.CollapseSecondaryTabsWidth, n = $("#transportControls > ." + h.SecondaryTabHeaderClass), o = $("#selectedSecondary");
        Panopto.viewer.allowMultipleSecondaryDisplay ? (o.hide(),
        n.hide()) : 1 === a.length && (e = _.filter(a[0].getTabs(), (function(e) {
            return !e.hiddenTab()
        }
        )),
        t ? (o.toggle(e.length > 1),
        n.css("display", "none")) : (o.toggle(e.length > h.MaxInlineSecondaryTabs),
        n.css("display", e.length > 1 && e.length <= h.MaxInlineSecondaryTabs ? "" : "none")))
    }
    ,
    e.expandLeftPane = function() {
        x && O && A(!0, void 0)
    }
    ,
    e.expandTimeline = function(t) {
        b.toggleClass(Panopto.Core.Constants.ExpandedClass, t),
        e.resize()
    }
    ,
    e.resizeCaption = function(t, n) {
        var a = o.getLeftPlayerElement()
          , r = o.getRightPlayerElements().first()
          , s = e.fullscreenPlayer()
          , l = s ? s === i ? a : r : c === f.Primary ? a : r
          , d = l.find(".screen:visible")
          , u = 0;
        s ? (l = l.find("video"),
        u = $(".fullscreen-controls").outerHeight(!0) + 10) : d.length && d.width() && d.offset().left > 0 && (l = d),
        "string" == typeof t && (D = Panopto.Core.TextHelpers.displayLineBreaks(Panopto.Core.TextHelpers.cleanTextWithoutHighlighting(t))),
        void 0 !== n && (L = n),
        s || !L ? (k.html(D),
        k.toggle(!!D).css({
            "max-height": l.height(),
            "max-width": l.width(),
            top: 0,
            left: 0
        }),
        l.offset() && k.css({
            left: l.offset().left + (l.width() - k.outerWidth()) / 2,
            top: l.offset().top + l.height() - k.outerHeight() - u
        })) : (I.html(D),
        k.hide())
    }
}
;
var PanoptoLegacy = Panopto = Panopto || {};
!function(e) {
    !function(e) {
        var t = PanoptoCore.Logging.Logger
          , n = function() {
            function n(o, i) {
                var a = this;
                this.quizzes = o,
                this.ltiConfig = i,
                this.completedCallback = new PanoptoCore.TypedCallback,
                this.closedCallback = new PanoptoCore.TypedCallback,
                this.results = {},
                this.isUpdatingResults = !1,
                this.onQuizCompleted = function(e) {
                    a.completedCallback.add(e)
                }
                ,
                this.onQuizClosed = function(e) {
                    a.closedCallback.add(e)
                }
                ,
                this.completeQuiz = function(e, t, n) {
                    var o = _.find(a.quizzes, (function(t) {
                        return t.id === e
                    }
                    ));
                    o && (o.isSessionPlaybackBlocking = !1,
                    a.ltiConfig && a.recordResult(e, t, n),
                    a.completedCallback.fire(o))
                }
                ,
                this.reportQuizResults = function(e, t, n) {
                    _.find(a.quizzes, (function(t) {
                        return t.id === e
                    }
                    )) && a.ltiConfig && a.recordResult(e, t, n)
                }
                ,
                this.closeQuiz = function(e) {
                    var t = _.find(a.quizzes, (function(t) {
                        return t.id === e
                    }
                    ));
                    a.closedCallback.fire(t)
                }
                ,
                this.recordResult = function(n, o, i) {
                    if (_.isNumber(o) && _.isNumber(i)) {
                        a.results[n] = {
                            correct: o,
                            questions: i
                        };
                        var r = _.values(a.results);
                        if (!_.contains(r, null)) {
                            var s = _.reduce(r, (function(e, t) {
                                return {
                                    correct: e.correct + t.correct,
                                    questions: e.questions + t.questions
                                }
                            }
                            ))
                              , l = Panopto.Core.StringHelpers.format(e.Constants.OutcomeFormat, s.correct / s.questions, a.ltiConfig.outcomeId, a.ltiConfig.oauthConsumerKey, a.ltiConfig.outcomeServiceUrl);
                            a.isUpdatingResults = !0;
                            var d = a.addAuthorizationHeader;
                            PanoptoCore.TokenAuth.getStoredAuthToken().then((function(n) {
                                $.ajax({
                                    type: "GET",
                                    url: e.Constants.LTIPage,
                                    data: l,
                                    beforeSend: function(e) {
                                        return d(e, n)
                                    },
                                    error: function(e) {
                                        t.warning("Exception while performing an LTI page get in recordResult", e)
                                    }
                                }).always((function() {
                                    a.isUpdatingResults = !1
                                }
                                ))
                            }
                            ))
                        }
                    }
                }
                ,
                n.instance = this,
                _.each(o, (function(e) {
                    a.results[e.id] = null
                }
                )),
                $(window).on("beforeunload.quizResultsCheck", (function() {
                    return a.isUpdatingResults || void 0
                }
                ))
            }
            return n.getInstance = function() {
                return n.instance
            }
            ,
            n.prototype.addAuthorizationHeader = function(e, t) {
                t && e.setRequestHeader("Authorization", "Bearer " + t)
            }
            ,
            n
        }();
        e.QuizResultsController = n
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            e[e.Single = 0] = "Single",
            e[e.Double = 1] = "Double",
            e[e.Quad = 2] = "Quad"
        }(e.SecondaryLayoutType || (e.SecondaryLayoutType = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        var n = function() {
            function n(e, n, o) {
                this.PrimaryDefaultIndex = -1,
                this._onSecondaryLayoutChanged = new PanoptoCore.TypedCallback,
                this.primaryPlayerIndex = this.PrimaryDefaultIndex,
                this.playerSwapHandlers = [],
                this.secondaryLayout = t.SecondaryLayoutType.Single,
                this.pageStructureElements = e,
                this.primaryPlayer = n,
                this.secondaryContentContainers = o
            }
            return Object.defineProperty(n.prototype, "onSecondaryLayoutChanged", {
                get: function() {
                    return this._onSecondaryLayoutChanged
                },
                enumerable: !1,
                configurable: !0
            }),
            n.prototype.getPrimaryPlayerIndex = function() {
                return this.viewMode !== e.Viewer.ViewMode.Secondary ? this.PrimaryDefaultIndex : this.primaryPlayerIndex
            }
            ,
            n.prototype.getLeftPlayer = function() {
                return this.primaryPlayerIndex === this.PrimaryDefaultIndex || this.viewMode !== e.Viewer.ViewMode.Secondary ? this.primaryPlayer : this.secondaryContentContainers[this.primaryPlayerIndex].getCurrentPlayer()
            }
            ,
            n.prototype.getLeftPlayerElement = function() {
                return this.primaryPlayerIndex === this.PrimaryDefaultIndex || this.viewMode !== e.Viewer.ViewMode.Secondary ? this.pageStructureElements.getPrimaryPlayer() : $(this.pageStructureElements.getSecondaryPlayers()[this.primaryPlayerIndex])
            }
            ,
            n.prototype.getRightPlayers = function() {
                var t = _.map(this.secondaryContentContainers, (function(e) {
                    return e.getCurrentPlayer()
                }
                ));
                return this.primaryPlayerIndex !== this.PrimaryDefaultIndex && this.viewMode === e.Viewer.ViewMode.Secondary && (t[this.primaryPlayerIndex] = this.primaryPlayer),
                t
            }
            ,
            n.prototype.getRightPlayerElements = function() {
                var t = this.pageStructureElements.getSecondaryPlayers();
                return this.primaryPlayerIndex !== this.PrimaryDefaultIndex && this.viewMode === e.Viewer.ViewMode.Secondary && (t[this.primaryPlayerIndex] = this.pageStructureElements.getPrimaryPlayer()[0]),
                t
            }
            ,
            n.prototype.getPlayerFromElement = function(e) {
                var t, n = this.pageStructureElements.getPlayerFromElement(e);
                if (1 === n.length)
                    if (n[0] === this.pageStructureElements.getPrimaryPlayer()[0])
                        t = this.primaryPlayer;
                    else {
                        var o = this.pageStructureElements.getSecondaryPlayers().toArray().indexOf(n[0]);
                        o >= 0 && (t = this.secondaryContentContainers[o].getCurrentPlayer())
                    }
                return t
            }
            ,
            n.prototype.setViewMode = function(e) {
                this.viewMode = e
            }
            ,
            n.prototype.swapLeftAndRight = function(e) {
                var t = this
                  , n = this.primaryPlayerIndex;
                this.primaryPlayerIndex = e,
                _.each(this.playerSwapHandlers, (function(e) {
                    return e(n, t.primaryPlayerIndex)
                }
                ))
            }
            ,
            n.prototype.onPlayerSwap = function(e) {
                _.contains(this.playerSwapHandlers, e) || this.playerSwapHandlers.push(e)
            }
            ,
            n.prototype.offPlayerSwap = function(e) {
                var t = this.playerSwapHandlers.indexOf(e);
                t >= 0 && (this.playerSwapHandlers = this.playerSwapHandlers.splice(t, 1))
            }
            ,
            n.prototype.getSecondaryLayout = function() {
                return this.secondaryLayout
            }
            ,
            n.prototype.getAllowedSecondaryLayouts = function() {
                return [t.SecondaryLayoutType.Single, t.SecondaryLayoutType.Double, t.SecondaryLayoutType.Quad]
            }
            ,
            n.prototype.setSecondaryLayout = function(e) {
                e !== this.secondaryLayout && (this.secondaryLayout = e,
                this._onSecondaryLayoutChanged.fire(this.secondaryLayout))
            }
            ,
            n
        }();
        t.StandardPlayerLayout = n
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    var t;
    t = e.Viewer || (e.Viewer = {}),
    function(t) {
        var n = function() {
            function t() {}
            return t.prototype.getPrimaryPlayer = function() {
                return $(t.primaryPlayerSelector)
            }
            ,
            t.prototype.getSecondaryPlayers = function() {
                return $(t.secondaryPlayerSelector)
            }
            ,
            t.prototype.getLeftPane = function() {
                return $("#leftPane")
            }
            ,
            t.prototype.getLeftPlayerContainer = function() {
                return $("#leftPlayerContainer")
            }
            ,
            t.prototype.getRightPane = function() {
                return $("#rightPane")
            }
            ,
            t.prototype.getRightPlayerContainer = function() {
                return $("#rightPlayersContainer")
            }
            ,
            t.prototype.getPlayerFromElement = function(e) {
                return e.closest(t.primaryPlayerSelector + ", " + t.secondaryPlayerSelector)
            }
            ,
            t.primaryPlayerSelector = "#primaryPlayer",
            t.secondaryPlayerSelector = "." + e.Viewer.Constants.SecondaryPlayerClass,
            t
        }();
        t.PageElements = n
    }(t.Viewer || (t.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    var t;
    t = e.Viewer || (e.Viewer = {}),
    function(t) {
        var n = function() {
            function t(e, t, n, o) {
                this.tabElements = [],
                this.contentContainer = e,
                this.tabContainer = t,
                this.selected = n,
                this.expander = o
            }
            return t.prototype.getTabs = function() {
                return $(this.tabElements)
            }
            ,
            t.prototype.getSelected = function() {
                return this.selected
            }
            ,
            t.prototype.getExpander = function() {
                return this.expander
            }
            ,
            t.prototype.getContentContainer = function() {
                return this.contentContainer
            }
            ,
            t.prototype.getContent = function() {
                return this.contentContainer.children().first()
            }
            ,
            t.prototype.addTab = function(e, t) {
                this.tabElements.push(e),
                this.selected.before(e),
                this.tabElements.push(t),
                this.expander.find(".flyout-close").before(t)
            }
            ,
            t.prototype.setContentClass = function(t) {
                this.getContent().attr("class", e.Viewer.Constants.SecondaryContentClass + " " + t)
            }
            ,
            t.prototype.setSelectedText = function(e) {
                this.selected.find("#selectedSecondaryText").text(e)
            }
            ,
            t.prototype.setSelectedIcon = function(e, t) {
                e ? this.selected.find("#selectedSecondaryIcon").html(e).attr("class", "material-icons") : this.selected.find("#selectedSecondaryIcon").html("").attr("class", t)
            }
            ,
            t
        }();
        t.TabElements = n
    }(t.Viewer || (t.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
var __spreadArray = this && this.__spreadArray || function(e, t, n) {
    if (n || 2 === arguments.length)
        for (var o, i = 0, a = t.length; i < a; i++)
            !o && i in t || (o || (o = Array.prototype.slice.call(t, 0, i)),
            o[i] = t[i]);
    return e.concat(o || Array.prototype.slice.call(t))
}
;
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.Discussion = Panopto.Viewer.Tabs.Discussion || {},
Panopto.Viewer.PlayState = Panopto.Viewer.PlayState || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
Panopto.Core = Panopto.Core || {},
Panopto.Core.PlayResumption = Panopto.Core.PlayResumption || {};
var Silverlight = Silverlight
  , WEBCAST_MAX_PLAY_SPEED_LIVE = 1;
Panopto.Viewer.Viewer = function(e, t, n, o, i, a, r) {
    var s, l, d, c, u, p, f, h, m, v, y, P, g, S, C, w, b, T, E, V, I, k, R, D, L, x, O, U, M, A, H = PanoptoCore.Logging.Logger, B = PanoptoTS.Viewer.Constants, F = (PanoptoTS.Viewer.Data,
    Panopto.Core.ErrorCode), N = new PanoptoViewer.ViewerLogging(Panopto.globalServicesFQDN), z = $.Deferred(), G = !1, j = [], Q = new PanoptoTS.Viewer.Controls.ManualFullScreenStateControlGroup, q = Panopto.Core.StringHelpers.parseQueryString(window.location.search.slice(1), !0, !0), W = "true" === q.edit, K = q.tid, J = !!q.notes, Y = parseInt(q.start, 10), X = !1, Z = Panopto.Viewer.PlayState.Paused, ee = 0, te = 0, ne = 0, oe = !1, ie = !0, ae = !1, re = !1, se = !0, le = !1, de = new PanoptoTS.Viewer.Viewer.PageElements, ce = PanoptoCore.CookieHelpers.getUserCookieField(Panopto.user.userKey, B.VolumeCookie), ue = !1, pe = new PanoptoTS.Viewer.Logic.DefaultPlayerSelectionLogic({
        isEditor: W,
        playerHelpers: e
    });
    PanoptoViewer.Players.FpPrimitivePlayer.setFlowplayerKey(Panopto.viewer.flowplayerKey);
    var fe, he, me, ve = '<div class="' + B.SecondaryPlayerClass + ' player"><div class="secondaryContent"></div></div>', ye = "true" === q.startMuted;
    q.outcome_did && (me = {
        outcomeId: q.outcome_did,
        oauthConsumerKey: q.oauth_consumer_key,
        outcomeServiceUrl: q.lis_outcome_service_url
    });
    var Pe, ge, Se = Panopto.Core.StringHelpers.parseQueryString(window.location.hash.slice(1)), Ce = Se.debug ? new PanoptoTS.Viewer.Controls.MockSessions(Panopto.Core.ServiceInterface.Rest.Sessions) : Panopto.Core.ServiceInterface.Rest.Sessions, we = new PanoptoTS.Viewer.EditorRouter((function() {
        g.isViewable = g.isReadyForEditing,
        g.isRecentBroadcast = !1,
        g.multiBitrateEnabled = !1,
        y && y.deregisterCallbacks(),
        y = Panopto.Viewer.Controls.Timeline.TimelineEditor(Se, e, C, g, Ce, (function() {
            e.resize = void 0,
            De(),
            y.overlayController.ready.then((function() {
                R.show(),
                e.resize()
            }
            ))
        }
        ))
    }
    ),(function() {
        var t = Panopto.Core.StringHelpers.format("<a href='#'>{0}</a>", Panopto.GlobalResources.ViewerPlus_Edit_ForceReprocess);
        Le(t);
        var n = $("#messageText a");
        Panopto.Core.UI.Handlers.button(n, (function() {
            e.toggleScreens(!1),
            Panopto.Application.defaultInstance.updateState({
                modalPage: "SessionManage",
                modalHeader: Panopto.Core.TextHelpers.innerText(g.title),
                modalParams: Panopto.Core.StringHelpers.serializeObjectToQueryString({
                    id: g.id
                })
            })
        }
        ))
    }
    ),(function() {
        window.location.href = Panopto.Core.StringHelpers.format(B.SilverlightEditorUrlTemplate, g.id)
    }
    ),(function() {
        Le(Panopto.GlobalResources.ViewerPlus_Edit_UnsupportedBrowser)
    }
    ),(function() {
        Le(Panopto.GlobalResources.ViewerPlus_Edit_SessionNotReady)
    }
    ),(function() {
        Le(Panopto.GlobalResources.ViewerPlus_Edit_PendingEditedTranscriptionRequest)
    }
    ),(function() {
        x.hide(),
        Panopto.Viewer.Header(e, g, void 0, void 0, void 0, t),
        new Panopto.EditorProcessing($("#processing"),{
            resources: Panopto.GlobalResources,
            delivery: g,
            deliveryThumbnailUrl: Panopto.viewer.data.thumbnailUrl
        })
    }
    )), be = function(t) {
        var n = l && l.visible() || Te();
        Pe === t && ge === n || (t && n || ($(".plugin-screen").css({
            "max-height": t ? "" : 0,
            border: t ? "" : 0,
            overflow: t ? "" : "hidden"
        }),
        e.resize && e.resize()),
        Pe = t,
        ge = n)
    }, Te = function() {
        return Panopto.Core.StringHelpers.parseQueryString(window.location.hash).modalPage
    }, Ee = function(t, n) {
        var o;
        te = n = "number" == typeof n ? n : Math.max(ee, e.position());
        var i, s, u, P, S, C, b, T = Date.now(), E = p.streamLength(), I = y ? y.timelinePosition(t, n) : n, k = g.firstQuizOffset;
        if (g.hasQuiz && Panopto.viewer.showQuizWarning && !Panopto.user.userId && !le && k + .1 > n && k - .1 < n) {
            e.setPlayState(r.Paused, !0, !1),
            le = !0;
            var R = Panopto.Core.StringHelpers.parseQueryString(window.location.search.slice(1)).tid
              , x = g.user.email || null
              , O = $("#proViewerSignupPopup");
            Panopto.SignupPromptPopup(O, {
                onClose: function() {
                    O.hide(),
                    e.setPlayState(r.Playing, !0, !1)
                },
                position: n,
                signupUrl: Panopto.freeTrialSignUpUrl,
                token: R,
                email: x,
                sendGoogleAnalytics: function(e, t) {
                    return Panopto.GoogleAnalytics.sendProEvent(e, t)
                },
                resources: Panopto.GlobalResources
            })
        }
        if (I !== n)
            I === y.timelineEndPosition() && (e.setPlayState(r.Paused, void 0, void 0),
            I -= PanoptoTS.Viewer.Constants.EditorTimelineEndOffsetSeconds),
            e.setPosition(I);
        else if (E > 0 && U !== E && (U = E,
        _.each(j, (function(e) {
            _.each(e.getTabs(), (function(e) {
                e.adjustTimeline(U)
            }
            ))
        }
        ))),
        n = Math.clamp(n, 0, U),
        i = Math.round(n),
        s = Math.max(0, Math.round(U - n)),
        v.synchronize(n, ne, t, !!y)) {
            w.state.playerState.position != n && w.setState({
                playerState: {
                    position: n
                }
            }),
            m && m.position(n),
            (t || !M || T - M > B.ControlSyncRate) && (M = T,
            u = Panopto.Core.TimeHelpers.formatDuration(i, Panopto.GlobalResources.TimeSeparator),
            P = (s ? "-" : "") + Panopto.Core.TimeHelpers.formatDuration(s, Panopto.GlobalResources.TimeSeparator),
            S = Panopto.Core.TimeHelpers.formatDuration(Math.round(U), Panopto.GlobalResources.TimeSeparator),
            d.synchronize(n, U, u, P, S)),
            y && y.synchronize(n, Z === r.Playing),
            Q.syncTimes(u, S),
            g.multiBitrateEnabled && d.synchronizeBitrate(),
            c && c.updateProgress(n),
            p.isEndedBy(n) && (C = g.isBroadcast && !ie,
            b = function() {
                Panopto.viewer.data.playlist ? l.queueNextItem() : !g.nextDelivery && !C || y ? y || e.isActiveBroadcast() || (e.setPosition(0),
                Panopto.Core.Browser.isIE11 && (e.setPlayState(r.Playing, !1, !1),
                e.setPlayState(r.Paused, !1, !1))) : (C ? (ae = !0,
                L.text(V)) : (e.setPosition(0),
                g.nextDelivery.folderName = g.folder.name,
                Panopto.Core.UI.Components.nextDelivery(L, g.nextDelivery, Panopto.GlobalResources.NextDelivery_NextVideo, Panopto.GlobalResources.NextDelivery_PlayAgain, (function() {
                    e.setPlayState(r.Playing, void 0, void 0)
                }
                ), Panopto.GlobalResources.NextDelivery_RecordingNow)),
                D.show(),
                be(!1))
            }
            ,
            e.setPlayState(r.Paused, !0, !0),
            g.requiresSilverlight ? setTimeout(b, 100) : b());
            var A = document.getElementById("primaryVideo")
              , H = (null === (o = null == A ? void 0 : A.textTracks) || void 0 === o ? void 0 : o.length) > 0;
            d.synchronizeCaption(H),
            function(t) {
                var n, o, i, r = e.fullscreenPlayer();
                g.captions && d.captionsSelected() && (o = g.captions[_.findLastIndex(g.captions, (function(e) {
                    return e.time < t
                }
                ))]);
                var s = document.getElementById("primaryVideo");
                (null === (n = null == s ? void 0 : s.textTracks) || void 0 === n ? void 0 : n.length) > 0 && g.isBroadcast && (!g.hasCaptions && d.captionsSelected() ? s.textTracks[0].mode = "showing" : s.textTracks[0].mode = "disabled"),
                i = o ? o.text : "",
                r ? r.getCaptionControl() && r.getCaptionControl().setCaptionText(i) : d.captionsDocked() ? (f && f.setCaptionText(""),
                h && h.setCaptionText("")) : e.viewMode() === a.Secondary ? (f && f.setCaptionText(""),
                h && h.setCaptionText(i)) : f && f.setCaptionText(i),
                e.resizeCaption(i, d.captionsDocked())
            }(n)
        }
        if (g.isBroadcast) {
            var F = d.playSpeed()
              , N = E - te;
            F > WEBCAST_MAX_PLAY_SPEED_LIVE && N <= 0 && (PanoptoCore.Logging.Logger.info("Viewer.synchronize: slowing down to max play speed, currently at or after live edge. currentPlaySpeed: " + F + " currentDiffFromEdge: " + N),
            d.setPlaySpeed(WEBCAST_MAX_PLAY_SPEED_LIVE))
        }
        ne = te
    }, Ve = function(t) {
        var n = Y;
        if (Panopto.Core.Browser.isIE) {
            Panopto.Application.defaultInstance.showNotificationBanner(Panopto.GlobalResources.DeprecateInternetExplorer11 + ' <a href="https://support.panopto.com/s/article/Internet-Explorer-11-Maintenance-Mode">' + Panopto.GlobalResources.DeprecateInternetExplorer11_LearnMore + "</a>", null, !0)
        }
        isNaN(n) && void 0 === Panopto.viewer.data.playlist && void 0 === y && (n = Panopto.Core.PlayResumption.calculateStartTime(g.lastViewingPosition, g.duration)),
        Panopto.viewer.disableSeekAndVsp && Panopto.viewer.enableSeekAndVspAfterPercentage && g.completionPercentage && g.completionPercentage > Panopto.viewer.enableSeekAndVspAfterPercentage && e.reportPercentCompleted(g.completionPercentage),
        y && !t || R.show(),
        function(t) {
            if (!p) {
                var n = $("#primaryScreen");
                if (Panopto.viewer.viewerWatermarkPosition) {
                    var o = new PanoptoViewer.WatermarkLogo(Panopto.branding.embedLogo.png,Panopto.viewer.viewerWatermarkPosition);
                    $("#primaryPlayer .letterbox").append(o.getBrandElem()),
                    Panopto.viewer.viewerWatermarkPosition === PanoptoViewer.Data.ViewerWatermarkPositionOptions.TopRight && o.setOffset(50)
                }
                var a = pe.getPlayerFactory(g)
                  , r = new PanoptoTS.Viewer.Players.AudioOnlyOverlay;
                r.getElement().insertAfter(n),
                r.onClick.add((function() {
                    e.togglePlaying(i.Labels.Normal)
                }
                )),
                r.onShowOverlay.add((function() {
                    y.streamTab().showUploadOverlay({
                        secondaryOnly: !1
                    })
                }
                )),
                p = y ? PanoptoLegacy.Viewer.Players.PrimarySegmentPlayer(de.getPrimaryPlayer(), n, a, e, y, r) : PanoptoLegacy.Viewer.Players.PrimaryPlayer(de.getPrimaryPlayer(), n, a, e, g, r, (function() {
                    return PanoptoViewer.handleSpanUpdateBlocked(Panopto.GlobalResources, Panopto.branding.accentColor, N, Panopto.enableAutomaticLogsUpload, Panopto.viewer.analyticsIngestBlockedSupportPageUrl, g.id, g.serverModel.InvocationId)
                }
                )),
                g.primaryStreams.length && e.reloadPrimaryContent(!0, t),
                f = p.getCaptionControl(),
                p.getFullscreenStateControl() && Q.add(p.getFullscreenStateControl())
            }
        }(n),
        w.setState({
            eventTabLogic: Ie()
        }),
        (A = new PanoptoTS.Viewer.StandardPlayerLayout(de,p,j)).onSecondaryLayoutChanged.add((function(t) {
            var n;
            switch (t) {
            case PanoptoTS.Viewer.SecondaryLayoutType.Single:
                n = 1;
                break;
            case PanoptoTS.Viewer.SecondaryLayoutType.Double:
                n = 2;
                break;
            case PanoptoTS.Viewer.SecondaryLayoutType.Quad:
                n = 4
            }
            e.setSecondaryCount(n)
        }
        ));
        var a = new PanoptoTS.Viewer.Controls.PlayerLayoutControls(y);
        if (a.onShowOverlay.add((function() {
            y.streamTab().showUploadOverlay({
                secondaryOnly: !1
            })
        }
        )),
        d = Panopto.Viewer.PlayControls(e, g, p, ce, de, A, j, a, !!y),
        function() {
            e.setSecondaryCount(1),
            m || y || (m = o.ThumbnailPlayer(g.thumbnails, e));
            var t = _.filter(g.documents, (function(e) {
                return e.isQuiz
            }
            ));
            new PanoptoTS.Viewer.QuizResultsController(t,me).onQuizCompleted((function() {
                return e.togglePlaying()
            }
            ))
        }(),
        PanoptoLegacy.Viewer.Layout(e, C, de, A, p, j, g, s, !1, y),
        U = g.isBroadcast ? 0 : g.duration,
        !Panopto.viewer.allowMultipleSecondaryDisplay)
            for (var u = 0, h = j; u < h.length; u++) {
                h[u].getTabControl().attachTabHandlers()
            }
        q.isscorm && (c = Panopto.Viewer.ScormControl(e, g.duration),
        $("#allBookmarksLink").hide()),
        ye && !p.isMuted() && e.toggleMuted();
        var v = I && !Panopto.viewer.data.playlist ? r.Playing : r.Paused
          , P = $("#ltiQuizBlock");
        Panopto.LTIQuizBlock(P, {
            deliveryId: g.id,
            sessionHasQuiz: g.hasQuiz,
            ltiBlockSetting: PanoptoViewer.LTIQuizBlockingMode[Panopto.viewer.blockLTISessionsWithQuiz],
            ltiQueryParam: q.outcome_did,
            checkBlockSessionOnQuizReporting: Panopto.Core.ServiceInterface.Rest.Sessions.blockSessionOnQuizReporting,
            onPopupResolved: function() {
                P.hide(),
                e.setPlayState(v, void 0, void 0)
            },
            resources: Panopto.GlobalResources
        }),
        !n || c || y ? c || Ee(!0, null) : e.setPosition(n),
        Panopto.Core.Browser.isIE && $(document).on("contextmenu", (function() {
            e.setPlayState(r.Paused, void 0, void 0)
        }
        )),
        e.toggleScreens(!Te()),
        k && !I && (d.toggleAutoplayMessage(!0),
        l && setTimeout((function() {
            l.hide()
        }
        ), l.autoHideDelay)),
        oe = !0
    }, _e = function(t) {
        if (x.hide(),
        re = !0,
        t && t.ErrorCode)
            switch (t.ErrorCode) {
            case F.SiteDisabled:
                e.toggleMessage(Panopto.GlobalResources.ViewerPlus_SiteDisabled);
                break;
            case F.LoginRequired:
                i.sendEvent({
                    action: i.Actions.Prereq,
                    label: i.Labels.Login
                }),
                window.location.href = Panopto.viewer.unauthorizedViewerTransferUrl;
                break;
            case F.AccessRequired:
                i.sendEvent({
                    action: i.Actions.Prereq,
                    label: i.Labels.Access
                }),
                window.location.href = t.RedirectUrl;
                break;
            case F.InvalidUrl:
                e.toggleMessage(Panopto.GlobalResources.ViewerPlus_InvalidUrl, Panopto.GlobalResources.ViewerPlus_WatchSomethingElse, B.SessionListUrl);
                break;
            case F.InvalidDelivery:
                e.toggleMessage(Panopto.GlobalResources.ViewerPlus_InvalidDelivery, Panopto.GlobalResources.ViewerPlus_WatchSomethingElse, B.SessionListUrl);
                break;
            case F.NotInAvailabilityWindow:
                e.toggleMessage(Panopto.GlobalResources.ViewerPlus_NotInAvailabilityWindow, Panopto.GlobalResources.ViewerPlus_WatchSomethingElse, B.SessionListUrl);
                break;
            case F.InvalidFormatForSSL:
                e.toggleMessage(Panopto.GlobalResources.ViewerPlus_InvalidFormatForSSL, Panopto.GlobalResources.ViewerPlus_WatchSomethingElse, B.SessionListUrl);
                break;
            case F.HasPendingMergeOrCopyJobs:
                e.toggleMessage(Panopto.GlobalResources.ViewerPlus_HasPendingMergeOrCopyJobs);
                break;
            case F.Archived:
                xe();
                break;
            case F.UnknownError:
            default:
                e.toggleMessage(Panopto.GlobalResources.ViewerPlus_UnknownError, Panopto.GlobalResources.ViewerPlus_ContactSupport, $(".support-email").attr("href"))
            }
        else
            Panopto.uriScheme !== window.location.protocol.replace(":", "") && Panopto.Core.Browser.isIE ? e.toggleMessage(Panopto.GlobalResources.ViewerPlus_IESSLWarning, Panopto.GlobalResources.ViewerPlus_IESSLLink, Panopto.viewer.secureBrowserHelpUrl) : e.toggleMessage(Panopto.GlobalResources.ViewerPlus_NetworkError)
    }, Ie = function() {
        return W ? new PanoptoTS.Viewer.Logic.EditorEventTabLogic(g,e,y,Ce,Se,t,Panopto.Core.ServiceInterface.Rest.TagsRequest,Panopto.Core.ServiceInterface.Rest.SubscriptionRequest,Panopto.Core.ServiceInterface.Rest.Users) : J ? new PanoptoTS.Viewer.Logic.LiveNotesEventTabLogic(g,e,t) : new PanoptoTS.Viewer.Logic.ViewerEventTabLogic(g,e,K,t,Panopto.Core.ServiceInterface.Rest.TagsRequest,Panopto.Core.ServiceInterface.Rest.SubscriptionRequest,Panopto.Core.ServiceInterface.Rest.Users)
    }, ke = function(n) {
        re = !1;
        var o, i = Panopto.Core.Browser.flashEnabled() && !Panopto.viewer.htmlPlaybackOnly, r = n.flowPlayerEnabled || !g.isBroadcast && Panopto.Core.Browser.supportsVideo(B.MP4MimeType);
        if (g = n,
        w.setState({
            delivery: g
        }),
        se = g.flowPlayerEnabled,
        q.isscorm && (g.nextDelivery = null),
        q.notes)
            g.user.key ? (s = Panopto.Viewer.Header(e, g, void 0, void 0, void 0, t),
            w.setState({
                eventTabLogic: Ie()
            }),
            A = new PanoptoTS.Viewer.StandardPlayerLayout(de,null,j),
            PanoptoLegacy.Viewer.Layout(e, C, de, A, null, j, g, s, !0, y),
            e.viewMode(a.LiveNotes),
            R.show(),
            Panopto.authCookieTimeoutMinutes && setInterval(t.refreshAuthCookie, 60 * Panopto.authCookieTimeoutMinutes * 1e3 / 2)) : window.location.href = Panopto.loginUrl + "?ReturnUrl=" + encodeURIComponent(window.location.href);
        else if (g.isViewable)
            if (e.toggleMessage(void 0),
            fe && fe.remove(),
            s = Panopto.Viewer.Header(e, g, I, y, Panopto.viewer.data.playlist, t),
            l = s.playlistOverlay(),
            g.requiresSilverlight)
                !(o = Silverlight.isInstalled(B.SilverlightVersion)) || g.activePrimary.mediaFileType === Panopto.Core.MediaFileType.wmv && Panopto.Core.Browser.isSafari ? (o ? e.toggleMessage(Panopto.GlobalResources.ViewerPlus_Webkit_WMV_Warning) : Panopto.Core.Browser.isSilverlightSupported ? $("#silverlightMessage").show() : e.toggleMessage(Panopto.GlobalResources.Silverlight_DisabledChromeViewer, Panopto.GlobalResources.Silverlight_DisabledLink, "https://support.panopto.com/ChromeSilverlight"),
                (r || i) && g.podcastCompleted && ($("#embedControl").show(),
                $("#embedControl").html(g.embedUrl))) : Ve();
            else if (r || i) {
                var d = g.primaryStreams.some((function(e) {
                    return 0 !== e.vrType
                }
                )) || g.secondaryStreams.some((function(e) {
                    return 0 !== e.vrType
                }
                ));
                Ve(d)
            } else
                Panopto.viewer.htmlPlaybackOnly ? e.toggleMessage(Panopto.GlobalResources.ViewerPlus_NoInternetExplorer) : e.toggleMessage(Panopto.GlobalResources.ViewerPlus_InstallOrEnable, Panopto.GlobalResources.ViewerPlus_AdobeFlashPlayer, B.FlashPlayerUrl, "adobe-download");
        else if (s = Panopto.Viewer.Header(e, g, I, y, Panopto.viewer.data.playlist, t),
        g.isBroadcast) {
            if (!g.activePrimary && !fe) {
                var c = Panopto.viewer.data.hasCustomThumbnail ? Panopto.viewer.data.thumbnailUrl : null;
                (fe = new PanoptoTS.Viewer.Controls.WaitingRoom($("#waitingRoomContainer"),g,c)).render()
            }
        } else
            Re()
    }, Re = function() {
        var t, n;
        g.folder.id ? (t = Panopto.GlobalResources.ViewerPlus_SessionNotReady_WatchSomethingElse.format(g.folder.name),
        n = Panopto.Application.getBookmarkURL(B.SessionListUrl, {
            folderID: g.folder.id
        })) : (t = Panopto.GlobalResources.ViewerPlus_WatchSomethingElse,
        n = B.SessionListUrl),
        e.toggleMessage(Panopto.GlobalResources.ViewerPlus_SessionNotReady + "<br>" + Panopto.GlobalResources.ViewerPlus_SessionNotReadyRefresh, t, n)
    }, De = function() {
        x.hide(),
        ke(g)
    }, Le = function(n) {
        x.hide(),
        s = Panopto.Viewer.Header(e, g, void 0, void 0, void 0, t),
        e.toggleMessage(n, Panopto.GlobalResources.ViewerPlus_Edit_MoreInformation, Panopto.viewer.editorSupportUrl)
    }, xe = function() {
        var t = function(e) {
            var t = $("#viewerArchivedPage");
            Panopto.ViewerArchivedPage(t, {
                resources: Panopto.GlobalResources,
                deliveryArchiveStatus: e,
                requestRestoreFromArchive: function(t, n) {
                    var o = [{
                        DeliveryID: e.deliveryId
                    }];
                    Panopto.Core.ServiceInterface.Rest.Sessions.batchRestoreFromArchive(o, t, n, $.noop)
                }
            })
        }
          , n = PanoptoTS.API.Rest.ServiceFactory.getArchiveService();
        q.id ? n.getDeliveryArchiveStatus(q.id, t, (function() {
            return e.toggleMessage(Panopto.GlobalResources.ViewerPlus_ArchivedRestoreUnavailable, Panopto.GlobalResources.ViewerPlus_WatchSomethingElse, B.SessionListUrl)
        }
        )) : q.tid && n.getDeliveryArchiveStatusByInviteId(q.tid, t, (function() {
            return e.toggleMessage(Panopto.GlobalResources.ViewerPlus_ArchivedRestoreUnavailable, Panopto.GlobalResources.ViewerPlus_WatchSomethingElse, B.SessionListUrl)
        }
        ))
    }, Oe = function(e, t) {
        var n = t;
        if (P)
            for (var o = _.findLastIndex(P, (function(t) {
                return t.start >= e
            }
            )), i = P[o]; i && i.start < e + n; )
                n += i.end - i.start,
                i = P[++o];
        return n
    };
    $(document).ready((function() {
        C = Panopto.Viewer.createViewerBridge($("#viewerBridge")),
        (w = C.viewer).onEventTabFocused = function() {
            return e.expandLeftPane()
        }
        ,
        w.onEventTabSelected = function() {
            return e.expandLeftPane()
        }
        ,
        new PanoptoTS.Viewer.Controls.EventPane(C);
        var o = "true" === q.edit
          , i = q.id;
        !i && Panopto.viewer.data.playlist && (i = Panopto.viewer.data.playlist.initialDeliveryId);
        var a = -1 !== navigator.userAgent.indexOf("Mac OS X 10_13");
        if (o && a && Panopto.Core.Browser.isSafari) {
            var r = {};
            try {
                r = JSON.parse(Panopto.viewer.hlsJsConfig)
            } catch (e) {
                H.warning("Error parsing HlsJsConfig setting, ignored.")
            }
            Panopto.viewer.hlsJsConfig = JSON.stringify(_.extend(r, {
                safari: !1
            }))
        }
        R = $("#viewerContent"),
        D = $("#inlineMessageLetterbox"),
        L = $("#inlineMessage"),
        (x = $("#loadingMessage")).show(),
        u = Panopto.Core.UI.Components.CopyrightNotice($("#copyrightNoticeContainer"), Panopto.viewer.copyrightNoticeText, 0);
        var s = Panopto.Core.StringHelpers.parseBoolean(q.advance);
        k = (Panopto.features.autoPlayEnabled && "false" !== q.autoplay || s) && !o;
        var l = 0 === ce || ye
          , d = PanoptoViewer.canAutoplay({
            muted: l,
            playsInline: !0,
            autoPlayRequested: k
        });
        he = function() {
            d.then((function(a) {
                I = a.canAutoplay,
                function(o, i, a) {
                    new PanoptoTS.Viewer.Controls.DeliveryRefreshTimer(o,i,a,!1,J,!0,null,null,t,n,(function(e) {
                        return S = e.SessionId,
                        new PanoptoTS.Viewer.Data.Delivery(e)
                    }
                    ),(function(e) {
                        g = e,
                        (Panopto.viewer.isHiveEnabled || Panopto.viewer.isKollectiveEnabled) && (g.primaryStreams.forEach((function(e) {
                            e.mediaFileType === Panopto.Core.MediaFileType.mp4 && (Panopto.viewer.isHiveEnabled = !1,
                            Panopto.viewer.isKollectiveEnabled = !1,
                            H.info("[Viewer] Disabling hive due to mp4 primary"))
                        }
                        )),
                        g.secondaryStreams.forEach((function(e) {
                            e.mediaFileType === Panopto.Core.MediaFileType.mp4 && (Panopto.viewer.isHiveEnabled = !1,
                            Panopto.viewer.isKollectiveEnabled = !1,
                            H.info("[Viewer] Disabling hive due to mp4 secondary"))
                        }
                        ))),
                        a ? g.user.role <= Panopto.Data.AclRoleType.Viewer ? window.location.href = Panopto.viewer.unauthorizedEditorTransferUrl : we.routeDelivery(g) : De()
                    }
                    ),ke,(function(t) {
                        e.updateDelivery(t)
                    }
                    ),(function() {
                        window.location.reload()
                    }
                    ),_e).start()
                }(q.id || i, q.tid, o)
            }
            ))
        }
        ,
        Panopto.viewer.data.playlist && Panopto.viewer.data.playlist.errorCode ? function(t) {
            switch (t) {
            case F.InvalidPlaylist:
            case F.InvalidPlaylistUrl:
                e.toggleMessage(Panopto.GlobalResources.ViewerPlus_InvalidPlaylist, Panopto.GlobalResources.ViewerPlus_WatchSomethingElse, B.SessionListUrl);
                break;
            case F.InvalidPlaylistNoSessions:
                e.toggleMessage(Panopto.GlobalResources.ViewerPlus_PlaylistHasNoViewableSessions, Panopto.GlobalResources.ViewerPlus_WatchSomethingElse, B.SessionListUrl);
                break;
            case F.UnknownError:
            default:
                e.toggleMessage(Panopto.GlobalResources.ViewerPlus_UnknownError, Panopto.GlobalResources.ViewerPlus_ContactSupport, $(".support-email").attr("href"))
            }
        }(Panopto.viewer.data.playlist.errorCode) : he(),
        o && ($(document).on("dragstart", (function(e) {
            e.target.classList.contains("ui-draggable") || e.preventDefault()
        }
        )),
        R.on("dragenter", (function() {
            y.streamTab().showUploadOverlay({
                secondaryOnly: !1
            })
        }
        )))
    }
    )),
    e.isDeliveryError = function() {
        return re
    }
    ,
    e.positionAutoplayMessage = function() {
        d && d.positionAutoplayMessage()
    }
    ,
    e.isLive = function() {
        return p && p.isLive()
    }
    ,
    e.position = function(t) {
        if (void 0 === t)
            return p ? p.position() : 0;
        e.isDVRDisabled() || (g.isBroadcast && p.setIsLive(t === 1 / 0, null),
        p.setPosition(t, null),
        g.isBroadcast && e.playState() === Panopto.Viewer.PlayState.Playing && p.setPlayStateWithLogging(Panopto.Viewer.PlayState.Playing, !0),
        ee = t,
        Ee(!0, t),
        D.hide(),
        be(!0),
        ae = !1)
    }
    ,
    e.getPosition = function() {
        return new PanoptoTS.Core.Logic.Time.UneditedFirstPrimaryRelative(e.position() * Panopto.Core.Constants.TimelineChunkMultiplier)
    }
    ,
    e.setPosition = e.position,
    e.playState = function(t, n, o) {
        if (void 0 === t)
            return Z;
        Panopto.Core.Browser.isSafari && e.isDVRDisabled() && !G ? d.togglePlayState(!0) : (d.togglePlayState(t === r.Paused),
        !Panopto.viewer.showCopyrightNotice || y ? z.resolve() : "pending" !== z.state() || u.isShowingNotice() || t !== r.Playing || p.onReady.then((function() {
            A.getLeftPlayerElement().hide(),
            A.getRightPlayerElements().hide(),
            u.showNotice((function() {
                A.getLeftPlayerElement().show(),
                A.getRightPlayerElements().show(),
                I || (t = r.Paused,
                d.togglePlayState(t === r.Paused)),
                z.resolve()
            }
            ))
        }
        )),
        z.done((function() {
            t !== Z && (g.isBroadcast && t === r.Paused && !n && p.setIsLive(!1, null),
            t === r.Playing && (ae ? e.setPosition(0) : g.isBroadcast && p.isLive() && (Panopto.Core.Browser.isSafari || (p.setIsLive(!1, null),
            e.setPlayState(r.Playing, void 0, void 0)),
            p.setIsLive(!0, (function() {
                e.synchronize(!0)
            }
            )))),
            p.setPlayStateWithLogging(t, !o),
            O && g.isBroadcast || (t === r.Paused ? clearInterval(O) : O = setInterval((function() {
                Ee(!1, null)
            }
            ), B.TimedSyncRate)),
            t === r.Playing && d.toggleAutoplayMessage(!1),
            Z = t,
            v.clearSyncTimeout(),
            _.each(j, (function(e) {
                var t = e.getCurrentPlayer();
                t && t.playState(Z)
            }
            )),
            Q.syncPlayState(Z),
            D.hide(),
            be(!0),
            y && y.synchronize(e.position(), Z === r.Playing))
        }
        )))
    }
    ,
    e.setPlayState = e.playState,
    e.reloadPrimaryContent = function(t, n) {
        n && p.setStartPosition(n),
        p.setPrimaryContent(g.primaryStreams, g.activePrimary, t, (function() {
            G = !0,
            e.synchronize(!0)
        }
        )),
        n && p.setStartPosition(void 0)
    }
    ,
    e.setPrimarySegments = function(t, n, o, i) {
        if (y && p && n.length && (P = _.filter(t, (function(e) {
            return !e.element.containsPrimary()
        }
        )),
        p.setSegments(t, n, o, i),
        !X && !isNaN(Y))) {
            var a = Oe(0, Y);
            e.setPosition(a),
            X = !0
        }
    }
    ,
    e.activePrimary = function() {
        return p.activePrimary()
    }
    ,
    e.activeSecondary = function() {
        var e = j.length > 0 && j[0].getTabControl().selectedTab();
        return e && e.content()
    }
    ,
    e.selectSecondaryTab = function(e, t) {
        j.length > 0 && j[0].getTabControl().selectTabById(e, t)
    }
    ,
    e.toggleMessage = function(t, n, o, i, a) {
        var s = $("#viewerMessage")
          , l = s.find("#messageLink");
        t ? (b = e.position(),
        oe && !E && (E = e.playState(),
        e.setPlayState(r.Paused, void 0, void 0)),
        e.setFullscreenPlayer(void 0),
        R.hide(),
        x.hide(),
        fe && fe.toggle(!1),
        s.find("#messageText").html(t),
        n ? (l.text(n).attr("href", o).show(),
        a && Panopto.Core.UI.Handlers.button(l, a)) : l.hide(),
        s.find("#messageIcon").removeClass().addClass(i).attr("href", o),
        s.show()) : s.is(":visible") && (s.hide(),
        oe ? (R.show(),
        e.reloadPrimaryContent(!0, e.position()),
        j.forEach((function(e) {
            var t = e.getStreamPlayer();
            t && t.setContent(t.content(), !0, null)
        }
        )),
        e.setPlayState(E, void 0, void 0),
        p.playState(E),
        g.isBroadcast || e.setPosition(b),
        E = void 0) : fe && fe.toggle(!0))
    }
    ,
    e.toggleScreens = function(t) {
        e.viewMode && e.viewMode() !== a.LiveNotes && !D.is(":visible") && (t && T ? (be(!0),
        e.setPlayState(T, void 0, void 0),
        T = void 0) : t || T || (T = Z,
        e.setPlayState(r.Paused, void 0, void 0),
        be(!1))),
        ue || (Panopto.ModalPopup.defaultInstance.hide((function() {
            e.toggleScreens(!0)
        }
        )),
        ue = !0)
    }
    ,
    e.playlistOverlayToggled = function(e) {
        se || be(!e)
    }
    ,
    e.fullscreenPlayer = function() {
        var e;
        if (p && p.isFullscreen())
            e = p;
        else {
            var t = _.find(j, (function(e) {
                return e.getStreamPlayer() && e.getStreamPlayer().isFullscreen()
            }
            ));
            t && (e = t.getStreamPlayer())
        }
        return e
    }
    ,
    e.setFullscreenPlayer = function(e) {
        p && p.setIsFullscreen(e === p);
        for (var t = 0, n = j; t < n.length; t++) {
            var o = n[t].getStreamPlayer();
            o && o.setIsFullscreen(e === o)
        }
    }
    ,
    e.isFullscreen = function() {
        return !!e.fullscreenPlayer()
    }
    ,
    e.ensureSecondaryIsMinimized = function() {
        j.forEach((function(e) {
            var t = e.getStreamPlayer();
            t && t.minimizeIfHidden()
        }
        ))
    }
    ,
    e.setCaptionStyles = function(e) {
        f && f.setCaptionStyles(e),
        h && h.setCaptionStyles(e)
    }
    ,
    e.synchronize = Ee,
    e.refreshPlayers = function() {
        _.each(j, (function(t) {
            t.reinitializeTabs(g, e),
            t.getTabControl().attachTabHandlers()
        }
        ))
    }
    ,
    e.updateDelivery = function(t) {
        g = t,
        R.is(":visible") && e.reloadPrimaryContent(!1, e.position()),
        j.forEach((function(t) {
            t.updateTabs(g, e, p.streamLength())
        }
        )),
        e.toggleMessage(void 0),
        g.broadcastEnded ? e.endBroadcast() : e.restartBroadcast()
    }
    ,
    e.endBroadcast = function() {
        var t;
        ie && (ie = !1,
        V = g.broadcastInterrupted ? Panopto.GlobalResources.ViewerPlus_BroadcastInterrupted : Panopto.GlobalResources.ViewerPlus_BroadcastEnded_Notification,
        t = g.activePrimary.relativeEnd - B.BroadcastEndThreshold,
        p.updateMaxPosition(t),
        e.position() > t && e.setPosition(t),
        w.setState({
            viewerState: _.extend({}, w.state, {
                isEnded: !0
            })
        }))
    }
    ,
    e.restartBroadcast = function() {
        ie || (ie = !0,
        ae = !1,
        p.updateMaxPosition(null),
        p.isLive() && (D.hide(),
        Panopto.Core.Browser.isSafari || (p.setIsLive(!1, null),
        e.setPlayState(r.Playing, void 0, void 0)),
        p.setIsLive(!0, (function() {
            e.synchronize(!0)
        }
        ))),
        w.setState({
            viewerState: _.extend({}, w.state.viewerState, {
                isEnded: !0
            })
        }))
    }
    ,
    e.isActiveBroadcast = function() {
        return g.isBroadcast && ie
    }
    ,
    e.logDesync = function(e, t, n, o) {
        o ? (i.sendDesyncEvent({
            diff: e,
            deliveryId: g.id,
            invocationId: g.invocationId,
            syncLogic: t,
            actionMessage: n
        }),
        H.info("(" + t + ") " + n + " for delta " + e)) : H.verbose("(" + t + ") " + n + " for delta " + e)
    }
    ,
    e.submitClientLog = function(e, t) {
        var n = {
            InvocationId: g.serverModel.InvocationId,
            Entries: __spreadArray(["SessionId: " + g.serverModel.SessionId], N.retrieveLogs(), !0)
        };
        Panopto.Core.ServiceInterface.WCFRest.DataCS.submitViewerClientLog(n, e, t)
    }
    ,
    e.togglePlaying = function(t) {
        if (!Te())
            if (i.sendEvent({
                action: Z === r.Playing ? i.Actions.Pause : i.Actions.Play,
                label: t || i.Labels.Fullscreen
            }),
            Z === r.Playing)
                e.setPlayState(r.Paused, void 0, void 0);
            else
                e.setPlayState(r.Playing, void 0, void 0)
    }
    ,
    e.rewind = function(t, n) {
        e.userSeekEnabled() && (i.sendEvent({
            action: i.Actions.Rewind,
            label: t || i.Labels.Fullscreen
        }),
        n = n || B.QuickRewindSeconds,
        n = function(e, t) {
            var n = t;
            if (P)
                for (var o = _.findLastIndex(P, (function(t) {
                    return t.end <= e
                }
                )), i = P[o]; i && i.end > e - n; )
                    n += i.end - i.start,
                    i = P[--o];
            return n
        }(e.position(), n),
        e.setPosition(Math.max(0, e.position() - n)))
    }
    ,
    e.skipToStart = function(t) {
        e.userSeekEnabled() && (i.sendEvent({
            action: i.Actions.SkipToStart,
            label: t || i.Labels.Fullscreen
        }),
        e.setPosition(0))
    }
    ,
    e.forward = function(t, n) {
        e.userSeekEnabled() && (i.sendEvent({
            action: i.Actions.Forward,
            label: t || i.Labels.Fullscreen
        }),
        n = n || B.QuickForwardSeconds,
        g.isBroadcast && p.isLive() || (n = Oe(e.position(), n),
        e.setPosition(Math.min(U, e.position() + n))))
    }
    ,
    e.skipToEnd = function(t) {
        e.userSeekEnabled() && (i.sendEvent({
            action: i.Actions.SkipToEnd,
            label: t || i.Labels.Fullscreen
        }),
        e.setPosition(U))
    }
    ,
    e.volumeUp = function(e, t) {
        e = e || i.Labels.Fullscreen,
        t = t || B.VolumeIncrement,
        d.updateVolume(p.volume() + t, !0, e)
    }
    ,
    e.volumeDown = function(e, t) {
        e = e || i.Labels.Fullscreen,
        t = t || B.VolumeIncrement,
        d.updateVolume(p.volume() - t, !0, e)
    }
    ,
    e.toggleMuted = function(e) {
        i.sendEvent({
            action: p.isMuted() ? i.Actions.Unmute : i.Actions.Mute,
            label: e || i.Labels.Fullscreen
        }),
        d.toggleMuted()
    }
    ,
    e.hotkey = function(t) {
        switch (t) {
        case B.PlayKeyCode:
            e.togglePlaying(i.Labels.Hotkey);
            break;
        case B.RewindKeyCode:
            e.rewind(i.Labels.Hotkey, B.PositionIncrement);
            break;
        case B.ForwardKeyCode:
            e.forward(i.Labels.Hotkey, B.PositionIncrement);
            break;
        case B.VolumeUpKeyCode:
            d.showVolumeControl(),
            e.volumeUp(i.Labels.Hotkey);
            break;
        case B.VolumeDownKeyCode:
            d.showVolumeControl(),
            e.volumeDown(i.Labels.Hotkey);
            break;
        case B.MuteKeyCode:
            e.toggleMuted(i.Labels.Hotkey)
        }
    }
    ,
    e.getQuestionList = function(e) {
        return y ? y.getQuestionList(e) : void 0
    }
    ,
    e.updateQuestionList = function(e) {
        return y ? y.updateQuestionList(e) : void 0
    }
    ,
    e.getSinglePageAppConfig = function() {
        return {
            quizFillInTheBlankEnabled: !0
        }
    }
    ,
    e.getSessionLength = function() {
        return y ? y.activeState().duration() / Panopto.Core.Constants.TimelineChunkToMillisMultiplier : void 0
    }
    ,
    e.getEvent = function(e) {
        return y ? y.getEvent(e) : void 0
    }
    ,
    e.validateEventTime = function(e) {
        return y ? y.validateEventTime(e) : void 0
    }
    ,
    e.updateEvent = function(e) {
        return y ? y.updateEvent(e) : void 0
    }
    ,
    e.isDVRDisabled = function() {
        var e = p.optimizationProvider() === PanoptoTS.Viewer.Constants.Hive && (Panopto.Core.Browser.isIE11 || Panopto.Core.Browser.isEdge || Panopto.Core.Browser.isSafari);
        return g.isBroadcast && e
    }
    ,
    e.userSeekEnabled = function() {
        var t = Boolean(p && e.isDVRDisabled());
        return !((Panopto.viewer.disableSeekAndVsp && !g.isBroadcast || t) && !y)
    }
    ,
    e.reportPercentCompleted = function(t) {
        Panopto.viewer.disableSeekAndVsp && Panopto.viewer.enableSeekAndVspAfterPercentage > 0 && Panopto.viewer.enableSeekAndVspAfterPercentage < t && e.updateDisableSeekAndVsp(!1)
    }
    ,
    e.updateDisableSeekAndVsp = function(t) {
        Panopto.viewer.disableSeekAndVsp !== t && (Panopto.viewer.disableSeekAndVsp = t,
        d && d.onUserSeekEnabledChanging(e.userSeekEnabled()))
    }
    ,
    e.setSecondaryCount = function(t) {
        if (t !== j.length) {
            for (; j.length < t; ) {
                var n, o = $.parseHTML(ve);
                de.getRightPlayerContainer().append(o),
                n = Panopto.viewer.allowMultipleSecondaryDisplay ? new PanoptoTS.Viewer.Controls.OverlayTabControlElements($(o)) : new PanoptoTS.Viewer.Viewer.TabElements($(o),$("#transportControls"),$("#selectedSecondary"),$("#secondaryExpander"));
                var i = new PanoptoTS.Viewer.Controls.SecondaryContentContainer(n,g,e,j.length);
                j.push(i);
                var a = i.getStreamPlayer();
                a && (h = a.getCaptionControl(),
                a.getFullscreenStateControl() && Q.add(a.getFullscreenStateControl()))
            }
            for (var r = A.getRightPlayerElements(); j.length > t; ) {
                $(r[j.length - 1]).remove(),
                (i = j[j.length - 1]).remove(),
                j.length = j.length - 1
            }
            if (t !== j.length) {
                var s = j.length;
                H.error("Expected to resolve to " + t + " secondary containers. Found " + s)
            }
            v && v.clearSyncTimeout(),
            j.length > 0 && (v = PanoptoTS.Viewer.Logic.PlayerSynchronizationLogicFactory.create(e, d, p, j)),
            e.resize && (e.isSecondarySwapAllowed() || A.getPrimaryPlayerIndex() === A.PrimaryDefaultIndex || e.swapLeftToRight(A.PrimaryDefaultIndex),
            e.resize(),
            e.synchronize())
        }
    }
    ,
    e.hasPendingSecondaryUploads = function() {
        return !!y && y.streamTab().hasPendingSecondaryUploads()
    }
    ,
    e.toggleSecondaryPlaceholder = function(e) {
        y && y.overlayController.toggleSecondaryPlaceholder(e)
    }
    ,
    e.reinitializeDelivery = function() {
        y.overlayController.closeOverlays(),
        he()
    }
    ,
    e.forceLeftPlayerHeight = !1,
    e.pageStructureElements = function() {
        return de
    }
    ,
    e.playerSelection = pe;
    var Ue = [];
    return e.addSessionNameUpdateListener = function(e) {
        Ue.push(e)
    }
    ,
    e.updateSessionName = function(e, t) {
        var n = t.fromHeader;
        Ue.forEach((function(t) {
            return t(e, {
                fromHeader: n
            })
        }
        ))
    }
    ,
    e.getSessionId = function() {
        return S
    }
    ,
    e
}
,
function(e) {
    !function(t) {
        !function(t) {
            var n = PanoptoCore.VoidCallback
              , o = function() {
                function t(e, t, o) {
                    this.blocked = e,
                    this.signupUrl = t,
                    this.resources = o,
                    this._onDismiss = new n
                }
                return Object.defineProperty(t.prototype, "onDismiss", {
                    get: function() {
                        return this._onDismiss
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                t.prototype.render = function() {
                    var n = this;
                    this.dialogTitle = this.blocked ? this.resources.QuotaDialog_OutOfHours : this.resources.QuotaDialog_TryPanopto,
                    this.dialogSubTitle = this.blocked ? "<div class='quota-dialog-subtitle-spacing'>" + this.resources.QuotaDialog_GetAccess + "</div>" : "",
                    this.panoptoLogo = e.ImageHelpers.getImageUrl("Header/Panopto_logo_2015.svg"),
                    this.element = $(t.template(this)),
                    this.blocked || Panopto.Core.UI.Handlers.button(this.element.find(".quota-dialog-close"), (function() {
                        n._onDismiss.fire()
                    }
                    ))
                }
                ,
                t.prototype.getElement = function() {
                    return this.element
                }
                ,
                t.template = _.template("\n            <div class='quota-anonymous-dialog quota-dialog'>\n                <@ if (!blocked) { @>\n                    <div class='quota-dialog-close'>\n                        <div class='material-icons'>close</div>\n                    </div>\n                <@ } @>\n                <div class='quota-dialog-header'><img src='<@- panoptoLogo @>' /></div>\n                <div class='quota-dialog-title'>\n                    <hr />\n                    <div class='quota-dialog-title-text'>\n                        <@= dialogTitle @>\n                        <div class='quota-dialog-subtitle'><@= dialogSubTitle @></div>\n                    </div>\n                    <hr />\n                </div>\n                <div class='quota-dialog-feature-container'>\n                    <div class='quota-dialog-feature'>\n                        <div class='material-icons'>videocam</div>\n                        <div class='quota-dialog-feature-text'><@- resources.QuotaDialog_Record @></div>\n                    </div>\n                    <div class='quota-dialog-feature'>\n                        <div class='material-icons'>create</div>\n                        <div class='quota-dialog-feature-text'><@- resources.QuotaDialog_Edit @></div>\n                    </div>\n                    <div class='quota-dialog-feature'>\n                        <div class='material-icons'>share</div>\n                        <div class='quota-dialog-feature-text'><@- resources.QuotaDialog_Share @></div>\n                    </div>\n                    <div class='quota-dialog-feature'>\n                        <div class='material-icons'>search</div>\n                        <div class='quota-dialog-feature-text'><@- resources.QuotaDialog_Search @></div>\n                    </div>\n                    <div class='quota-dialog-feature'>\n                        <div class='material-icons'>lock</div>\n                        <div class='quota-dialog-feature-text'><@- resources.QuotaDialog_Privacy @></div>\n                    </div>\n                </div>\n                <div class='quota-dialog-buttons'>\n                    <a\n                        href='<@- signupUrl @>'\n                        target='<@- blocked ? \"_self\" : \"_blank\" @>'\n                        class='quota-dialog-button'\n                        onclick='Panopto.GoogleAnalytics.sendProSignupEvent(\"viewers-popup-click\");'\n                    >\n                        <@- resources.QuotaDialog_SignUp @>\n                    </a>\n                </div>\n                <div class='quota-dialog-bottom-padding'></div>\n            </div>\n        "),
                t
            }();
            t.AnonymousUserDialog = o
        }(t.QuotaPlaybackModalDialogs || (t.QuotaPlaybackModalDialogs = {}))
    }(e.Controls || (e.Controls = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = function() {
                function t(e) {
                    this.resources = e
                }
                return t.prototype.render = function() {
                    this.panoptoLogo = e.ImageHelpers.getImageUrl("Header/Panopto_logo_2015.svg"),
                    this.element = $(t.template(this)),
                    Panopto.Core.UI.Handlers.button(this.element.find(".upgrade-link-dialog"), (function() {
                        Panopto.GoogleAnalytics.sendProUpgradeEvent(PanoptoCore.ProUpgradeActions.Open, PanoptoCore.ProUpgradeLabels.OpenFromOwner),
                        Panopto.ProUpgradePopup()
                    }
                    ))
                }
                ,
                t.prototype.getElement = function() {
                    return this.element
                }
                ,
                t.template = _.template("\n            <div class='quota-owner-dialog quota-dialog'>\n                <div class='quota-dialog-header'><img src='<@- panoptoLogo @>' /></div>\n                <div class='quota-dialog-title'>\n                    <hr />\n                    <div class='quota-dialog-title-text'><@- resources.QuotaDialog_Title_Owner @></div>\n                    <hr />\n                </div>\n                <div class='quota-dialog-feature-container'>\n                    <@- resources.QuotaDialog_Instructions_Owner @>\n                </div>\n                <div class='quota-dialog-buttons upgrade-link-dialog'>\n                    <a class='quota-dialog-button'>\n                        <@- resources.QuotaDialog_Upgrade @>\n                    </a>\n                </div>\n                <div class='quota-dialog-bottom-padding'></div>\n            </div>\n        "),
                t
            }();
            t.OwnerDialog = n
        }(t.QuotaPlaybackModalDialogs || (t.QuotaPlaybackModalDialogs = {}))
    }(e.Controls || (e.Controls = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = function() {
                function t(e) {
                    this.resources = e
                }
                return t.prototype.render = function() {
                    this.panoptoLogo = e.ImageHelpers.getImageUrl("Header/Panopto_logo_2015.svg"),
                    this.element = $(t.template(this))
                }
                ,
                t.prototype.getElement = function() {
                    return this.element
                }
                ,
                t.template = _.template("\n            <div class='quota-viewer-dialog quota-dialog'>\n                <div class='quota-dialog-header'><img src='<@- panoptoLogo @>' /></div>\n                <div class='quota-dialog-title'>\n                    <hr />\n                    <div class='quota-dialog-title-text'><@- resources.QuotaDialog_Title_Viewer @></div>\n                    <hr />\n                </div>\n                <div class='quota-dialog-feature-container'>\n                    <@- resources.QuotaDialog_Instructions_Viewer @>\n                </div>\n                <div class='quota-dialog-bottom-padding'></div>\n            </div>\n        "),
                t
            }();
            t.ViewerDialog = n
        }(t.QuotaPlaybackModalDialogs || (t.QuotaPlaybackModalDialogs = {}))
    }(e.Controls || (e.Controls = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = PanoptoCore.Logging.Logger
              , o = function() {
                function t(e, t) {
                    this.queues = {},
                    this.name = e,
                    this.currentState = t
                }
                return t.prototype.getCurrentState = function() {
                    return this.currentState
                }
                ,
                t.prototype.getCurrentTransition = function() {
                    return this.currentTransition
                }
                ,
                t.prototype.handleTrigger = function(e, n, o) {
                    var i = this.createTriggerRecord(e, n, o);
                    null != this.currentTriggerRecord || this.getInternalQueue(t.mainQueue).data.length ? this.queueTrigger(t.mainQueue, i) : this.runTrigger(i)
                }
                ,
                t.prototype.getInternalQueue = function(t) {
                    var n = this.queues[t.name];
                    return n || (n = new e.Logic.StateMachine.Machine.TriggerRecordQueue(t.name),
                    this.queues[t.name] = n),
                    n
                }
                ,
                t.prototype.shouldQueueTrigger = function(e, n) {
                    var o = !0;
                    if (!n.completeCallback) {
                        var i, a = this.getInternalQueue(e);
                        a.data.length ? i = a.data[a.data.length - 1] : e === t.mainQueue && (i = this.currentTriggerRecord),
                        i && i.trigger === n.trigger && i.data === n.data && (o = !1)
                    }
                    return o
                }
                ,
                t.prototype.logQueue = function(e) {
                    var t = _.reduce(e.data, (function(e, t, n) {
                        return e + "[" + n + "] " + t.trigger.name + " "
                    }
                    ), "");
                    n.verbose(Panopto.Core.StringHelpers.format("[{0}] {1} {2}: {3}", this.name, "Queue", e.name, t))
                }
                ,
                t.prototype.getTransition = function(e, t) {
                    return _.find(e.transitions, (function(e) {
                        return e.trigger === t.trigger
                    }
                    ))
                }
                ,
                t.prototype.getExpectedState = function(e, t) {
                    var n;
                    if (e) {
                        var o = this.getTransition(e, t);
                        o ? (n = o.toState) ? n.triggerOnEnter && (n = this.getExpectedState(n, this.createTriggerRecord(n.triggerOnEnter, void 0, void 0))) : n = e : _.contains(e.ignoreTriggers, t.trigger) && (n = e)
                    }
                    return n
                }
                ,
                t.prototype.queueTrigger = function(e, n) {
                    if (this.shouldQueueTrigger(e, n)) {
                        var o = this.getInternalQueue(e);
                        e === t.mainQueue && (o.expectedEndState || (o.expectedEndState = this.getExpectedState(this.currentState, this.currentTriggerRecord)),
                        n.expectedStartState = o.expectedEndState,
                        o.expectedEndState = this.getExpectedState(o.expectedEndState, n)),
                        o.data.push(n),
                        this.logTriggerRecord(n, e === t.mainQueue ? "Queued" : "Delay queued"),
                        this.logQueue(o)
                    }
                }
                ,
                t.prototype.createTriggerRecord = function(e, t, n) {
                    return {
                        trigger: e,
                        data: t,
                        completeCallback: n
                    }
                }
                ,
                t.prototype.logTriggerRecord = function(e, t) {
                    var o = new Date
                      , i = Panopto.Core.StringHelpers.format("[{0}] {1}:{2}.{3} {4} trigger {5} from state {6}{7}{8}", this.name, o.getMinutes(), o.getSeconds(), o.getMilliseconds(), t, e.trigger.name, this.currentState.name, void 0 !== e.data ? " with data " + ("object" == typeof e.data ? JSON.stringify(e.data) : e.data) : "", e.expectedStartState ? " expectedState " + e.expectedStartState.name : "");
                    n.verbose(i)
                }
                ,
                t.prototype.runTrigger = function(e) {
                    var n = this
                      , o = this.getTransition(this.currentState, e);
                    if (o)
                        if (o.delayToQueue)
                            this.queueTrigger(o.delayToQueue, e);
                        else {
                            this.currentTriggerRecord = e,
                            this.currentTransition = o;
                            var i = this.getInternalQueue(t.mainQueue);
                            if (this.currentTriggerRecord.expectedStartState !== this.currentState && i.data.length) {
                                this.currentTriggerRecord.expectedStartState = this.currentState;
                                var a = !1
                                  , r = this.currentState;
                                _.each(i.data, (function(e) {
                                    a || e.expectedStartState === r ? a = !0 : (e.expectedStartState = r,
                                    r = n.getExpectedState(r, e))
                                }
                                )),
                                a || (i.expectedEndState = r)
                            }
                            this.logTriggerRecord(e, "Running");
                            var s = function() {
                                n.detachEvent && n.detachEvent(void 0),
                                e.completeCallback && e.completeCallback(),
                                n.exitTransition(n.currentTransition, e.data)
                            };
                            if (this.currentTransition.exitEvent && this.attachEvent(void 0, this.currentTransition.exitEvent, s),
                            o.releaseQueue) {
                                i = this.getInternalQueue(t.mainQueue);
                                var l = this.getInternalQueue(o.releaseQueue);
                                i.data = l.data.concat(i.data),
                                l.data.length = 0,
                                l.expectedEndState = void 0
                            }
                            o.action ? o.action(e.data, s) : s()
                        }
                    else
                        _.contains(this.currentState.ignoreTriggers, e.trigger) || this.logTriggerRecord(e, "No transition for"),
                        this.exitTransition(void 0, void 0)
                }
                ,
                t.prototype.enterState = function(e) {
                    var t = this;
                    _.any(this.currentState.transitions, (function(e) {
                        return !!e.triggerEvent
                    }
                    )) && this.detachEvent(this.currentState),
                    this.currentState = e,
                    _.each(this.currentState.transitions, (function(e) {
                        e.triggerEvent && t.attachEvent(t.currentState, e.triggerEvent, (function() {
                            return t.handleTrigger(e.trigger, void 0, void 0)
                        }
                        ))
                    }
                    ))
                }
                ,
                t.prototype.exitTransition = function(e, o) {
                    if (e && e !== this.currentTransition)
                        n.info("Transition ended which is not the current transition");
                    else {
                        var i;
                        this.currentTriggerRecord = void 0,
                        this.currentTransition = void 0,
                        e && e.toState && (this.enterState(e.toState),
                        e.toState.triggerOnEnter && (i = this.createTriggerRecord(e.toState.triggerOnEnter, o, void 0)));
                        var a = this.getInternalQueue(t.mainQueue);
                        !i && a.data.length && (i = a.data[0],
                        a.data = a.data.slice(1),
                        a.expectedEndState = void 0),
                        i && this.runTrigger(i)
                    }
                }
                ,
                t.mainQueue = {
                    name: "main"
                },
                t
            }();
            t.Machine = o
        }(t.StateMachine || (t.StateMachine = {}))
    }(e.Logic || (e.Logic = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            !function(e) {
                var t = function(e) {
                    this.name = e,
                    this.data = []
                };
                e.TriggerRecordQueue = t
            }(e.Machine || (e.Machine = {}))
        }(e.StateMachine || (e.StateMachine = {}))
    }(e.Logic || (e.Logic = {}))
}(PanoptoTS || (PanoptoTS = {}));
var __extends = this && this.__extends || function() {
    var e = function(t, n) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        ,
        e(t, n)
    };
    return function(t, n) {
        if ("function" != typeof n && null !== n)
            throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function o() {
            this.constructor = t
        }
        e(t, n),
        t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype,
        new o)
    }
}();
!function(e) {
    !function(e) {
        !function(e) {
            var t = function(e) {
                function t() {
                    return null !== e && e.apply(this, arguments) || this
                }
                return __extends(t, e),
                t.prototype.renderElement = function() {
                    var e = {
                        primaryImage: Panopto.cacheRoot + "/Images/upload_primary_stream_large.svg",
                        secondaryImage: Panopto.cacheRoot + "/Images/upload_secondary_stream.svg",
                        resx: this.resources
                    };
                    this.element = $(t.template(e)),
                    this.overlayUploader.attachPrimaryTargetHandler(this.element.find(".primary-stream .graphic-container")),
                    this.overlayUploader.attachSecondaryOrSlidesTargetHandler(this.element.find(".secondary-stream .graphic-container"))
                }
                ,
                t.template = _.template('\n            <div class="session-overlay">\n                <a\n                    href="#"\n                    class="close-button"\n                    role="button"\n                    aria-label="<@- resx.Viewer_ClosePopup @>">\n                    <i class="material-icons">&#xE5CD;</i>\n                </a>\n                <table class="overlay-table">\n                    <tr>\n                        <td class="title-cell" colspan="2">\n                            <div class="overlay-title">\n                                <@- resx.ViewerPlus_PrimaryOrSecondaryOverlay_Title @>\n                            </div>\n                            <div class="processing-status" style="display:none;"></div>\n                        </td>\n                    </tr>\n                    <tr class="expanded-row">\n                        <td class="primary-stream side-by-side-cell">\n                            <div class="graphic-container" tabindex="0">\n                                <div class="graphic standard-graphic">\n                                    <img src="<@- primaryImage @>" class="standard-graphic-image primary-stream-graphic">\n                                    <div>\n                                        <span class="primary-stream-text"><@- resx.ViewerPlus_PrimaryOverlay_Subtitle @></span>\n                                    </div>\n                                </div>\n                                <i class="material-icons graphic drop-target-graphic">&#xE2C6;</i>\n                            </div>\n                        </td>\n                        <td class="secondary-stream side-by-side-cell">\n                            <div class="graphic-container" tabindex="0">\n                                <div class="graphic standard-graphic">\n                                    <img src="<@- secondaryImage @>" class="standard-graphic-image secondary-stream-graphic">\n                                    <div>\n                                        <span class="secondary-stream-text"><@- resx.ViewerPlus_SecondaryOverlay_Subtitle @></span>\n                                    </div>\n                                </div>\n                                <i class="material-icons graphic drop-target-graphic">&#xE2C6;</i>\n                            </div>\n                        </td>\n                    </tr>\n                </table>\n            </div>'),
                t
            }(e.AddStreamOverlay);
            e.AddPrimaryOrSecondaryOverlay = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
__extends = this && this.__extends || function() {
    var e = function(t, n) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        ,
        e(t, n)
    };
    return function(t, n) {
        if ("function" != typeof n && null !== n)
            throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function o() {
            this.constructor = t
        }
        e(t, n),
        t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype,
        new o)
    }
}();
!function(e) {
    !function(e) {
        !function(e) {
            var t = function(e) {
                function t() {
                    return null !== e && e.apply(this, arguments) || this
                }
                return __extends(t, e),
                t.prototype.renderElement = function() {
                    var e = {
                        sessionImage: Panopto.cacheRoot + "/Images/upload_primary_stream_small.svg",
                        resx: this.resources
                    };
                    this.element = $(t.template(e)),
                    this.overlayUploader.attachPrimaryTargetHandler(this.element.find(".graphic-container"))
                }
                ,
                t.template = _.template('\n            <div class="session-overlay">\n                <a\n                    href="#"\n                    class="close-button"\n                    role="button"\n                    aria-label="<@- resx.Viewer_ClosePopup @>">\n                    <i class="material-icons">&#xE5CD;</i>\n                </a>\n                <table class="overlay-table">\n                    <tr>\n                        <td class="title-cell">\n                            <div class="overlay-title">\n                                <@- resx.ViewerPlus_PrimaryOverlay_Title @>\n                            </div>\n                            <div class="processing-status" style="display:none;"></div>\n                        </td>\n                    </tr>\n                    <tr class="expanded-row">\n                        <td>\n                            <div class="graphic-container" tabindex="0">\n                                <div class="graphic standard-graphic">\n                                    <img src="<@- sessionImage @>" class="standard-graphic-image primary-stream-graphic" />\n                                    <div>\n                                        <span class="primary-stream-text"><@- resx.ViewerPlus_PrimaryOverlay_Subtitle @></span>\n                                    </div>\n                                </div>\n                                <i class="material-icons graphic drop-target-graphic">&#xE2C6;</i>\n                            </div>\n                        </td>\n                    </tr>\n                </table>\n            </div>'),
                t
            }(e.AddStreamOverlay);
            e.AddPrimaryOverlay = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
__extends = this && this.__extends || function() {
    var e = function(t, n) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        ,
        e(t, n)
    };
    return function(t, n) {
        if ("function" != typeof n && null !== n)
            throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function o() {
            this.constructor = t
        }
        e(t, n),
        t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype,
        new o)
    }
}();
!function(e) {
    !function(e) {
        !function(e) {
            var t = function(e) {
                function t() {
                    return null !== e && e.apply(this, arguments) || this
                }
                return __extends(t, e),
                t.prototype.renderElement = function() {
                    var e = {
                        sessionImage: Panopto.cacheRoot + "/Images/upload_secondary_stream.svg",
                        resx: this.resources
                    };
                    this.element = $(t.template(e)),
                    this.overlayUploader.attachSecondaryOrSlidesTargetHandler(this.element.find(".graphic-container"))
                }
                ,
                t.template = _.template('\n            <div class="session-overlay">\n                <a\n                    href="#"\n                    class="close-button"\n                    role="button"\n                    aria-label="<@- resx.Viewer_ClosePopup @>">\n                    <i class="material-icons">&#xE5CD;</i>\n                </a>\n                <table class="overlay-table">\n                    <tr>\n                        <td class="title-cell">\n                            <div class="overlay-title">\n                                <@- resx.ViewerPlus_SecondaryOverlay_Title @>\n                            </div>\n                            <div class="processing-status" style="display:none;"></div>\n                        </td>\n                    </tr>\n                    <tr class="expanded-row">\n                        <td>\n                            <div class="graphic-container" tabindex="0">\n                                <div class="graphic standard-graphic">\n                                    <img src="<@- sessionImage @>" class="standard-graphic-image secondary-stream-graphic" />\n                                    <div>\n                                        <span class="secondary-stream-text"><@- resx.ViewerPlus_SecondaryOverlay_Subtitle @></span>\n                                    </div>\n                                </div>\n                                <i class="material-icons graphic drop-target-graphic">&#xE2C6;</i>\n                            </div>\n                        </td>\n                    </tr>\n                </table>\n            </div>'),
                t
            }(e.AddStreamOverlay);
            e.AddSecondaryOverlay = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(t) {
            var n = function() {
                function t(n, o, i, a, r, s, l, d, c, u, p, f, h, m, v, y) {
                    var P = this;
                    this.deliveryId = n,
                    this.tokenId = o,
                    this.isEditing = i,
                    this.isEmbed = a,
                    this.isLiveNotes = r,
                    this.refreshAuthCookie = s,
                    this.overrideFQDN = l,
                    this.uniqueViewerId = d,
                    this.deliveryService = c,
                    this.webcastVersionService = u,
                    this.deliveryTransform = p,
                    this.onDeliverySet = f,
                    this.onDeliveryViewable = h,
                    this.onBroadcastUpdated = m,
                    this.onBroadcastReopened = v,
                    this.onFatalError = y,
                    this.webcastApiPermanentError = !1,
                    this.retryCount = 0,
                    this.refreshDelivery = function() {
                        var e;
                        P.deliveryService.getDelivery(P.deliveryId, P.tokenId, null !== (e = P.invocationId) && void 0 !== e ? e : P.delivery ? P.delivery.invocationId : void 0, {
                            refreshAuthCookie: P.refreshAuthCookie,
                            isActiveBroadcast: P.isActiveBroadcast,
                            isEditing: P.isEditing,
                            isEmbed: P.isEmbed,
                            isLiveNotes: P.isLiveNotes,
                            overrideFQDN: P.overrideFQDN,
                            uniqueViewerIdParam: P.uniqueViewerId
                        }, P.handleDeliverySuccess, P.handleDeliveryError)
                    }
                    ,
                    this.refreshWebcastVersion = function() {
                        P.webcastVersionService.getWebcastVersion(P.deliveryId, P.handleWebcastVersionSuccess, P.handleWebcastVersionError)
                    }
                    ,
                    this.handleDeliverySuccess = function(n) {
                        P.retryCount = 0;
                        var o = P.delivery;
                        P.delivery = P.deliveryTransform(n),
                        o ? P.delivery.isBroadcast && !o.isBroadcast || P.isEmbed && P.delivery.isBroadcast && P.delivery.isViewable && !o.isViewable ? P.onBroadcastReopened(P.delivery) : P.isEmbed || !P.delivery.isViewable || o.isViewable ? P.isEmbed && P.delivery.podcastCompleted && !o.podcastCompleted ? P.onDeliveryViewable(P.delivery) : P.delivery.isViewable && P.delivery.isBroadcast && P.onBroadcastUpdated(P.delivery) : P.onDeliveryViewable(P.delivery) : P.onDeliverySet(P.delivery),
                        P.webcastVersion = P.delivery.webcastVersionId,
                        P.isActiveBroadcast = P.isActiveBroadcast || P.delivery.isBroadcast,
                        P.delivery.isBroadcast ? (P.refreshInterval = P.delivery.broadcastRefreshInterval,
                        P.webcastApiRefreshInterval = P.delivery.webcastApiRefreshInterval) : P.isEmbed || P.delivery.isViewable ? P.isEmbed && !P.delivery.podcastCompleted ? (P.refreshInterval = P.refreshInterval ? P.refreshInterval *= 1.5 : e.Constants.DeliveryRefreshInterval,
                        P.refreshInterval = Math.min(P.refreshInterval, t.maxProcessingPingIntervalMsec),
                        P.webcastApiRefreshInterval = void 0) : P.delivery.isRecentBroadcast ? (P.refreshInterval = e.Constants.ReopenedBroadcastInterval,
                        P.webcastApiRefreshInterval = P.delivery.webcastApiRefreshInterval) : (P.refreshInterval = void 0,
                        P.webcastApiRefreshInterval = void 0) : (P.refreshInterval = e.Constants.DeliveryRefreshInterval,
                        P.webcastApiRefreshInterval = P.delivery.webcastApiRefreshInterval),
                        P.setRefreshTimeout()
                    }
                    ,
                    this.handleDeliveryError = function(t) {
                        !P.delivery || P.retryCount >= e.Constants.DeliveryRefreshRetryCount || t && t.ErrorCode && t.ErrorCode !== Panopto.Core.ErrorCode.UnknownError ? P.onFatalError(t) : (P.retryCount++,
                        P.setRefreshTimeout())
                    }
                    ,
                    this.handleWebcastVersionSuccess = function(e) {
                        P.webcastVersion !== e ? P.callRefreshDelivery(P.webcastApiRefreshInterval) : P.setRefreshTimeout()
                    }
                    ,
                    this.handleWebcastVersionError = function(e, t, n) {
                        switch (e.status) {
                        case 404:
                            P.callRefreshDelivery(P.webcastApiRefreshInterval);
                            break;
                        case 503:
                            P.callRefreshDelivery(P.refreshInterval);
                            break;
                        default:
                            P.webcastApiPermanentError = !0,
                            P.callRefreshDelivery(P.refreshInterval)
                        }
                    }
                    ,
                    this.callRefreshDelivery = function(e) {
                        window.setTimeout(P.refreshDelivery, Math.floor(Math.random() * e))
                    }
                }
                return t.prototype.start = function() {
                    this.refreshDelivery()
                }
                ,
                t.prototype.stop = function() {
                    window.clearTimeout(this.timeoutHandle)
                }
                ,
                t.prototype.resume = function() {
                    this.setRefreshTimeout()
                }
                ,
                t.prototype.setInvocationId = function(e) {
                    this.invocationId = e
                }
                ,
                t.prototype.setRefreshTimeout = function() {
                    this.webcastVersion && this.webcastApiRefreshInterval && !this.webcastApiPermanentError ? this.timeoutHandle = window.setTimeout(this.refreshWebcastVersion, this.webcastApiRefreshInterval) : this.refreshInterval && (this.timeoutHandle = window.setTimeout(this.refreshDelivery, this.refreshInterval))
                }
                ,
                t.maxProcessingPingIntervalMsec = 3e5,
                t
            }();
            t.DeliveryRefreshTimer = n
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e(t, n, o, i) {
                    var a = this;
                    this._editCallbacks = new PanoptoCore.TypedCallback,
                    this._deleteCallbacks = new PanoptoCore.TypedCallback;
                    var r = $(e.template());
                    r.appendTo(t),
                    n.click((function(e) {
                        e.stopPropagation()
                    }
                    )),
                    i && i.toggleAppearsOnHover && Panopto.Core.UI.Handlers.hoverableParent(t, n);
                    var s = "edit-menu-open";
                    Panopto.Core.UI.Components.popup(r, n, (function() {
                        r.show();
                        var e = n.offset().top;
                        r.offset({
                            left: n.offset().left + n.outerWidth() - r.outerWidth(),
                            top: e < $(window).height() / 2 ? e + n.outerHeight() : e - r.height()
                        }),
                        t.addClass(s)
                    }
                    ), (function() {
                        r.hide(),
                        t.removeClass(s)
                    }
                    )),
                    this.editButton = $(e.editButtonTemplate({
                        resources: o
                    })),
                    this.editButton.appendTo(r),
                    Panopto.Core.UI.Handlers.button(this.editButton, (function() {
                        n.focus(),
                        a._editCallbacks.fire(a.event)
                    }
                    )),
                    this.deleteButton = $(e.deleteButtonTemplate({
                        resources: o
                    })),
                    this.deleteButton.appendTo(r),
                    Panopto.Core.UI.Handlers.button(this.deleteButton, (function() {
                        n.focus(),
                        a._deleteCallbacks.fire(a.event)
                    }
                    ))
                }
                return Object.defineProperty(e.prototype, "editCallbacks", {
                    get: function() {
                        return this._editCallbacks
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "deleteCallbacks", {
                    get: function() {
                        return this._deleteCallbacks
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                e.prototype.setEvent = function(e, t) {
                    this.event = e,
                    this.editButton.toggle(!!t.canEdit),
                    this.deleteButton.toggle(!!t.canDelete)
                }
                ,
                e.template = _.template("\n            <div class='edit-event-menu' style='display:none;'></div>\n        "),
                e.editButtonTemplate = _.template("\n            <div class='edit-event-menu-button menu-edit-button' tabindex='0' style='display:none;'>\n                <i class='material-icons'>&#xE150;</i>\n                <span><@= resources.ViewerPlus_EventEdit @></span>\n            </div>\n        "),
                e.deleteButtonTemplate = _.template("\n            <div class='edit-event-menu-button menu-delete-button' tabindex='0' style='display:none;'>\n                <i class='material-icons'>&#xE872;</i>\n                <span><@= resources.ViewerPlus_EventDelete @></span>\n            </div>\n        "),
                e
            }();
            e.EditEventMenu = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
__extends = this && this.__extends || function() {
    var e = function(t, n) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        ,
        e(t, n)
    };
    return function(t, n) {
        if ("function" != typeof n && null !== n)
            throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function o() {
            this.constructor = t
        }
        e(t, n),
        t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype,
        new o)
    }
}();
!function(e) {
    !function(e) {
        !function(e) {
            var t = function(e) {
                function t() {
                    return null !== e && e.apply(this, arguments) || this
                }
                return __extends(t, e),
                t.prototype.renderElement = function() {
                    var e = {
                        sessionImage: Panopto.cacheRoot + "/Images/video_player.svg",
                        resources: this.resources
                    };
                    this.element = $(t.template(e)),
                    this.overlayUploader.attachPrimaryTargetHandler(this.element.find(".graphic-container"))
                }
                ,
                t.prototype.show = function() {
                    e.prototype.show.call(this, !1)
                }
                ,
                t.template = _.template('\n            <div class="session-overlay empty-session-overlay">\n                <table class="overlay-table">\n                    <tr>\n                        <td class="title-cell">\n                            <p class="overlay-title">\n                                <@- resources.ViewerPlus_EmptySessionOverlay_Title @>\n                            </p>\n                            <p>\n                                <@- resources.ViewerPlus_EmptySessionOverlay_Subtitle @>\n                            </p>\n                        </td>\n                    </tr>\n                    <tr class="expanded-row">\n                        <td>\n                            <div class="graphic-container" tabindex="0">\n                                <div class="graphic standard-graphic">\n                                    <img src="<@- sessionImage @>" class="standard-graphic-image primary-stream-graphic" />\n                                    <div>\n                                        <span class="primary-stream-text"><@- resources.ViewerPlus_EmptySessionOverlay_Target @></span>\n                                    </div>\n                                </div>\n                                <i class="material-icons graphic drop-target-graphic">&#xE2C6;</i>\n                            </div>\n                        </td>\n                    </tr>\n                </table>\n            </div>'),
                t
            }(e.AddStreamOverlay);
            e.EmptySessionOverlay = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e(e) {
                    this.eventTabPanes = $("#eventTabPanes"),
                    this.onResize = this.onResize.bind(this),
                    this.eventPaneBridge = e.eventPane,
                    this.eventPaneBridge.onResize = this.onResize
                }
                return e.prototype.onResize = function(e) {
                    e && e.width > 0 && e.height > 0 && (this.eventTabPanes.width(e.width),
                    _.each(this.eventPaneBridge.state.tabSet.tabs, (function(t) {
                        t.resize(e.width, e.height)
                    }
                    )))
                }
                ,
                e
            }();
            e.EventPane = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e(t, n) {
                    this.resources = n,
                    t.html(e.template()),
                    this.element = t.find(".file-processing-region")
                }
                return e.prototype.render = function(e) {
                    var t = this.element.find(".file-processing-text")
                      , n = this.element.find(".file-processing-percentage")
                      , o = this.element.find(".upload-spinner")
                      , i = "error";
                    if (_.some(e, (function(e) {
                        return 1 !== e.state && 2 !== e.state
                    }
                    )))
                        t.addClass(i).text(this.resources.FileProcessingRegion_Error),
                        n.hide(),
                        o.hide();
                    else if (1 === e.length) {
                        var a = e[0];
                        if (t.removeClass(i),
                        1 === a.state)
                            t.text(Panopto.Core.StringHelpers.format(this.resources.FileProcessingRegion_Uploading, a.filename)),
                            n.show().text(Math.round(a.bytesUploaded / a.fileSize * 100) + "%"),
                            o.hide();
                        else
                            t.text(Panopto.Core.StringHelpers.format(this.resources.FileProcessingRegion_Processing, a.filename)),
                            n.hide(),
                            o.show()
                    } else
                        t.removeClass(i).text(Panopto.Core.StringHelpers.format(this.resources.FileProcessingRegion_ProcessingMultiple, e.length)),
                        n.hide(),
                        o.show()
                }
                ,
                e.template = _.template('\n            <div class="file-processing-region">\n                <span class="file-processing-text"></span>\n                <span class="file-processing-percentage"></span>\n                <span class="upload-spinner"></span>\n            </div>'),
                e
            }();
            e.FileProcessingRegion = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Header = function(e, t, n, o, i, a) {
    var r, s, l, d, c, u, p = PanoptoTS.Viewer.Constants, f = $("#viewerHeader"), h = f.find("#logoContainer"), m = f.find("#deliveryTitle"), v = f.find("#editDeliveryTitle"), y = v.find("input"), P = f.find("#parentContext"), g = f.find("#starRating"), S = f.find("#podcastDownload"), C = f.find("#settingsButton"), w = f.find("#shareButton"), b = f.find("#editButton"), T = f.find("#statsButton"), E = f.find("#viewerHelpLink"), V = f.find("#signUpButton"), I = f.find("#signInButton"), k = f.find(".login-status"), R = f.find("#saveMessage"), D = f.find("#undoButton"), L = f.find("#redoButton"), x = f.find("#commitButton"), O = f.find("#revertButton"), U = f.find("#closeButton"), M = t.user.rating || 0, A = !Panopto.Core.Browser.inIframe() || Panopto.viewer.linksEnabledInIframe, H = PanoptoTS.StringHelpers.format("{0}/Pages/Sessions/List.aspx", p.BaseUrl);
    !function() {
        var e;
        if (i)
            e = {
                icon: "&#xE05F;",
                name: i.name
            };
        else if (t.folder.name)
            e = {
                icon: "&#xE2C7;",
                name: t.folder.name
            };
        else {
            var n = $("<div />");
            s = n,
            l = n,
            d = n
        }
        e && (P.html(_.template($("#parentContextTemplate").html())(e)),
        r = P.find("#parentClickTarget"),
        s = P.find(".parent-icon"),
        l = P.find("#parentName"),
        d = P.find(".chevron"),
        i ? (r.attr("aria-label", Panopto.GlobalResources.Viewer_PlaylistButton),
        s.addClass("playlist-icon"),
        l.addClass("ellipsis")) : t.folder.name && t.folder.id && A ? (r.attr("role", "link"),
        r.attr("aria-label", Panopto.GlobalResources.Folder),
        Panopto.Core.UI.Handlers.button(r, (function() {
            return window.open(PanoptoTS.StringHelpers.format("{0}?folderID={1}", H, t.folder.id))
        }
        ))) : r.removeAttr("tabindex").addClass(Panopto.Core.Constants.DisabledClass))
    }();
    var B = [h, s, l, d, m, v, g, S, R, D, L, x, O, C, w, b, T, U, E, I]
      , F = o ? [{
        elements: [h, s, l, d, v, R, D, L, x, O, C, T, U, E]
    }, {
        elements: [h, s, d, v, R, D, L, x, O, C, T, U, E]
    }, {
        elements: [h, s, d, v, R, D, L, x, O, U, E]
    }, {
        elements: [h, s, d, v, R, D, L, x, O, E]
    }, {
        elements: [h, s, d, v, R, D, L, x, O]
    }, {
        elements: [h, s, R, D, L, x, O]
    }, {
        elements: [h, s, D, L, x, O]
    }, {
        elements: [h, s]
    }] : [{
        elements: [h, s, l, d, m, g, S, C, w, b, T, E, I]
    }, {
        elements: [h, s, d, m, g, S, C, w, b, T, E, I]
    }, {
        elements: [h, s, d, m, S, C, w, b, T, E, I]
    }, {
        elements: [h, s, d, m, E, I]
    }, {
        elements: [h, s, d, m, E]
    }, {
        elements: [h, s, E]
    }, {
        elements: [h, s]
    }]
      , N = !1
      , z = Panopto.Core.StringHelpers.parseQueryString(window.location.search.slice(1))
      , G = p.LeftPaneMinWidth
      , j = function() {
        var e = $(window).width() > 1400;
        e && t.title.length <= p.MaxDesktopTitleCharacters || !e && t.title.length <= p.MaxMobileTitleCharacters ? m.text(t.title) : (K = e ? Math.floor((p.MaxDesktopTitleCharacters - Panopto.GlobalResources.ViewerPlus_TitleEllipsis.length) / 2) : Math.floor((p.MaxMobileTitleCharacters - Panopto.GlobalResources.ViewerPlus_TitleEllipsis.length) / 2),
        W = t.title.slice(0, K) + Panopto.GlobalResources.ViewerPlus_TitleEllipsis + t.title.slice(-K),
        m.text(W),
        m.attr("title", t.title))
    }
      , Q = function() {
        if (!N) {
            q(B).show(),
            i && l.css("max-width", G - l[0].offsetLeft),
            j(),
            _.each(F, (function(e) {
                e.width = _.reduce(e.elements, (function(e, t) {
                    return e + t.outerWidth(!0)
                }
                ), 0)
            }
            ));
            var e = $(window).width()
              , t = _.find(F, (function(t) {
                return t.width < e - p.HeaderBuffer
            }
            ));
            q(B).hide(),
            t && q(t.elements).show()
        }
    }
      , q = function(e) {
        return _.reduce(e, (function(e, t) {
            return e.add(t)
        }
        ), $())
    };
    var W, K, J = function() {
        $(document).attr("title", y.val()),
        Q()
    }, Y = (Panopto.Core.TimeHelpers.utcDateToFormattedString(t.date, "LL"),
    f.find("#viewerSupportDropdown")), X = Y.find(".send-client-log"), Z = function(e) {
        e.width(0),
        e.css({
            visibility: "hidden"
        })
    };
    if (Panopto.Branding.createLogo(h, Panopto.branding.smallLogo, A),
    $(document).attr("title", t.title),
    o ? (y.attr(Panopto.Core.Constants.InitAttribute, t.title),
    c = Panopto.Core.UI.Components.editableLabel(y, (function(t) {
        var n = o.session();
        n.name = t,
        Panopto.Core.ServiceInterface.Rest.Sessions.update(n, (function() {
            c.save(),
            e.updateSessionName(t, {
                fromHeader: !0
            }),
            J()
        }
        ), (function() {
            c.revert(),
            n.name = y.val()
        }
        ))
    }
    )),
    e.addSessionNameUpdateListener((function(e, t) {
        t.fromHeader || (c.resetValue(e),
        J())
    }
    ))) : j(),
    t.downloadUrl ? Panopto.Core.UI.Handlers.button(S, (function() {
        window.open(t.downloadUrl, "_self")
    }
    )) : Z(S),
    t.user.permissions[PanoptoTS.Core.Permission.SessionEditContent] && A ? (o && (Panopto.ModalPopup.defaultInstance.opener = o,
    o.updateData = function() {
        window.location.reload()
    }
    ),
    t.isBroadcast || o ? Z(b) : Panopto.Core.UI.Handlers.button(b, (function() {
        var n = Panopto.Core.StringHelpers.setQueryParameters(location.href, {
            id: t.id,
            edit: !0,
            start: e.position()
        });
        location.href = n
    }
    ))) : Z(b),
    t.user.permissions[PanoptoTS.Core.Permission.SessionEditMetadata] && A ? Panopto.Core.UI.Handlers.button($("#settingsButton"), (function() {
        e.toggleScreens(!1),
        Panopto.Application.defaultInstance.updateState({
            modalPage: "SessionInfo",
            modalHeader: Panopto.Core.TextHelpers.innerText(t.title),
            modalParams: Panopto.Core.StringHelpers.serializeObjectToQueryString({
                id: t.id
            })
        })
    }
    )) : Z(C),
    t.user.permissions[PanoptoTS.Core.Permission.SessionShareAccessControlPolicyEnumerate] && A)
        Panopto.Core.UI.Handlers.button($("#shareButton"), (function() {
            e.toggleScreens(!1),
            Panopto.Application.defaultInstance.updateState({
                modalPage: "SessionShare",
                modalHeader: Panopto.Core.TextHelpers.innerText(t.title),
                modalParams: Panopto.Core.StringHelpers.serializeObjectToQueryString({
                    id: t.id
                })
            })
        }
        ));
    else if (Panopto.features.viewerLinkShareEnabled && A) {
        var ee = PanoptoReactComponents.bootstrapReactComponent(PanoptoReactComponents.Control.LinkShare)($("#linkShareModal"), {
            isDialogOpen: !1,
            startTime: 0,
            resources: Panopto.GlobalResources,
            formatLink: function(e) {
                return Panopto.uriScheme + "://" + Panopto.webServerFQDN + Panopto.appRoot + "/Pages/Viewer.aspx?id=" + t.id + (e ? "&start=" + e : "")
            },
            onClose: function() {
                return ee.setProps({
                    isDialogOpen: !1
                })
            }
        });
        Panopto.Core.UI.Handlers.button($("#shareButton"), (function() {
            ee.setProps({
                isDialogOpen: !0,
                startTime: e.getPosition().seconds()
            })
        }
        ))
    } else
        Z(w);
    if (t.user.permissions[PanoptoTS.Core.Permission.SessionViewAnalytics] && A && !Panopto.features.disableFeaturesRequiringExternalNetworkAccess ? Panopto.Core.UI.Handlers.button(T, (function() {
        var e = !o && t.isBroadcast ? {
            webcastId: t.id
        } : {
            sessionId: t.id
        }
          , n = (new PanoptoTS.Locations).getAnalyticsDashboardUrl(e);
        window.open(n)
    }
    )) : Z(T),
    i) {
        var te = !Panopto.Core.StringHelpers.parseBoolean(z.advance);
        u = new PanoptoTS.Core.UI.Components.PlaylistOverlay($("#playlistOverlay"),r,i.id,z.id,PanoptoTS.Core.UI.Components.PlaylistOverlaySkin.Interactive,{
            includeViewableOnly: !0
        },te,n && !e.isDeliveryError(),new PanoptoTS.Core.API.Rest.PlaylistWithSessionsService);
        var ne = function(t) {
            r.toggleClass("active", t),
            e.playlistOverlayToggled(t)
        };
        ne(te),
        u.onToggle(ne),
        u.onPlayItem((function(n) {
            if (n === t.id)
                e.activePrimary() && e.setPlayState(Panopto.Viewer.PlayState.Playing, void 0, void 0);
            else {
                var o = Panopto.Core.StringHelpers.setQueryParameters(location.href, {
                    id: n,
                    advance: !0
                });
                location.replace(o)
            }
        }
        ))
    }
    if (t.user.key && Panopto.features.areRatingsEnabled && !o)
        var oe = PanoptoReactComponents.bootstrapReactComponent(PanoptoReactComponents.Input.RatingSelector)(g, {
            currentRating: M,
            resources: Panopto.GlobalResources,
            onRatingSelected: function(e) {
                oe.setProps({
                    currentRating: e
                }),
                a.rateDelivery(t.id, e, (function() {
                    M = e
                }
                ), (function() {
                    oe.setProps({
                        currentRating: M
                    })
                }
                ))
            }
        });
    if (A) {
        var ie = new PanoptoTS.Core.UI.Components.PopupMenuBehavior({
            menu: Y,
            menuButton: E,
            itemSelector: "a, input"
        });
        ie.onOpened.add((function() {
            e.toggleScreens(!1),
            Y.css({
                right: $(window).width() - E.offset().left - E.outerWidth(),
                top: E.offset().top + E.outerHeight()
            })
        }
        )),
        ie.onClosed.add((function() {
            return e.toggleScreens(!0)
        }
        )),
        X.show(),
        Panopto.Core.UI.Handlers.button(X, (function() {
            e.submitClientLog((function(e) {
                alert(Panopto.GlobalResources.ViewerPlus_LogsSent + e)
            }
            ), (function() {
                alert(Panopto.GlobalResources.ViewerPlus_LogsError)
            }
            ))
        }
        ))
    } else
        Z(E),
        Z(I);
    if (!t.user.key && Panopto.features.minimizeInteractiveViewerHeaderUX && (Z(E),
    Z(k)),
    Panopto.freeTrialSignUpUrl && !t.user.key) {
        var ae = Panopto.freeTrialSignUpUrl;
        if (z.tid) {
            var re = t.user.email || "null";
            ae += Panopto.Core.Constants.SignUpUrlParams.format(z.tid, re)
        }
        V.attr("href", ae)
    } else
        V.hide();
    return f.show(),
    Q(),
    h.find("image").length || h.find("img").on("load error", Q),
    {
        height: function() {
            return f.outerHeight()
        },
        setLeftPaneWidth: function(e) {
            G = e,
            Q()
        },
        playlistOverlay: function() {
            return u
        },
        toggleLiveNotes: function(e) {
            N = e,
            f.toggleClass(p.LiveNotesClass, N),
            g.toggle(!N)
        }
    }
}
,
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e() {
                    this.items = new Array
                }
                return e.prototype.add = function(e) {
                    this.items.some((function(t, n, o) {
                        return t === e
                    }
                    )) || this.items.push(e)
                }
                ,
                e.prototype.syncTimes = function(e, t) {
                    this.items.forEach((function(n, o, i) {
                        return n.syncTimes(e, t)
                    }
                    ))
                }
                ,
                e.prototype.syncPlayState = function(e) {
                    this.items.forEach((function(t, n, o) {
                        return t.syncPlayState(e)
                    }
                    ))
                }
                ,
                e
            }();
            e.ManualFullScreenStateControlGroup = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e() {}
                return e.getStreamIconCode = function(e) {
                    var t;
                    switch (e.type) {
                    case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Audio:
                        t = Panopto.Core.Constants.AudioIconCode;
                        break;
                    case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Screen:
                        t = Panopto.Core.Constants.ScreenIconCode;
                        break;
                    case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Camera:
                    default:
                        t = Panopto.Core.Constants.ObjectVideoIconCode
                    }
                    return t
                }
                ,
                e
            }();
            e.MaterialDesignIconHelpers = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e() {
                    this.sortedChildren = [],
                    this.element = $(e.template())
                }
                return e.prototype.contains = function(e) {
                    return _.some(this.sortedChildren, (function(t) {
                        return t.childElement === e
                    }
                    ))
                }
                ,
                e.prototype.insert = function(e, t) {
                    this.contains(e) && this.remove(e, !0);
                    var o = new n(e,t)
                      , i = _.find(this.sortedChildren, (function(e) {
                        return e.sortValue > o.sortValue
                    }
                    ));
                    i ? (this.sortedChildren.splice(this.sortedChildren.indexOf(i), 0, o),
                    i.childElement.before(o.childElement)) : (this.sortedChildren.push(o),
                    this.element.append(o.childElement))
                }
                ,
                e.prototype.remove = function(e, t) {
                    void 0 === t && (t = !1);
                    var n = _.find(this.sortedChildren, (function(t) {
                        return t.childElement === e
                    }
                    ));
                    n && (this.sortedChildren.splice(this.sortedChildren.indexOf(n), 1),
                    t ? n.childElement.detach() : n.childElement.remove())
                }
                ,
                e.prototype.rowCount = function() {
                    return this.sortedChildren.length
                }
                ,
                e.template = _.template("<div></div>"),
                e
            }();
            e.OrderedContainer = t;
            var n = function(e, t) {
                this.childElement = e,
                this.sortValue = t
            }
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = PanoptoCore.VoidCallback
              , o = function() {
                function t(e, o, i) {
                    var a = this;
                    this.pageStructureElements = e,
                    this.overlayUploader = o,
                    this.resources = i,
                    this.ready = $.Deferred(),
                    this._onShowOverlays = new n,
                    this._onCloseOverlays = new n,
                    this.overlayShowingClickHandler = function(e) {
                        $(e.target).closest(t.sessionOverlaySelector).length || a.overlayShown && a.closeOverlays()
                    }
                    ,
                    document.addEventListener("click", this.overlayShowingClickHandler, !0)
                }
                return Object.defineProperty(t.prototype, "onShowOverlays", {
                    get: function() {
                        return this._onShowOverlays
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "onCloseOverlays", {
                    get: function() {
                        return this._onCloseOverlays
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                t.prototype.setOverlaysStreamUploader = function(e) {
                    this.overlayUploader.setStreamUploader(e),
                    this.overlayUploader.areUploadersSet() && this.setupUploadOverlays(this.pageStructureElements)
                }
                ,
                t.prototype.setOverlaysSlideUploader = function(e) {
                    this.overlayUploader.setSlideUploader(e),
                    this.overlayUploader.areUploadersSet() && this.setupUploadOverlays(this.pageStructureElements)
                }
                ,
                t.prototype.setEditSlidesTabAddButton = function(e) {
                    this.editSlidesTabAddButton = e
                }
                ,
                t.prototype.setupUploadOverlays = function(n) {
                    var o = this
                      , i = $("#primaryPlayer .letterbox")
                      , a = n.getRightPlayerContainer();
                    a.css("position", "relative");
                    var r = function() {
                        o.closeOverlays()
                    };
                    $("#viewerContent").find(t.sessionOverlaySelector).remove(),
                    i.find(t.sessionOverlaySelector).remove(),
                    a.find(t.sessionOverlaySelector).remove(),
                    this.emptySessionOverlay = new e.Viewer.Controls.EmptySessionOverlay($("#viewerContent"),this.overlayUploader,r,this.resources),
                    this.primaryOrSecondaryOverlay = new e.Viewer.Controls.AddPrimaryOrSecondaryOverlay(i,this.overlayUploader,r,this.resources),
                    this.primaryOverlay = new e.Viewer.Controls.AddPrimaryOverlay(i,this.overlayUploader,r,this.resources),
                    this.secondaryPlaceholder = new e.Viewer.Controls.SecondaryPlaceholder(a,this.overlayUploader,r,this.resources),
                    this.secondaryOverlay = new e.Viewer.Controls.AddSecondaryOverlay(a,this.overlayUploader,r,this.resources),
                    this.overlayUploader.attachSlidesTargetHandler(this.editSlidesTabAddButton),
                    this.ready.resolve()
                }
                ,
                t.prototype.filterPendingUploadsByType = function(e, t) {
                    return _.filter(e, (function(e) {
                        return e.streamType === t
                    }
                    ))
                }
                ,
                t.prototype.showOverlays = function(t, n, o, i, a) {
                    var r = (void 0 === a ? {} : a).secondaryOnly
                      , s = void 0 !== r && r
                      , l = this.filterPendingUploadsByType(o, 1).length > 0
                      , d = this.filterPendingUploadsByType(o, 2).length > 0;
                    t || l ? (this.emptySessionOverlay.hide(),
                    i === e.Viewer.ViewMode.Primary ? (this.primaryOverlayCloseable = t,
                    this.primaryOrSecondaryOverlay.show(this.primaryOverlayCloseable),
                    this.primaryOverlay.hide(),
                    this.secondaryOverlay.hide(),
                    this.secondaryPlaceholder.hide()) : i === e.Viewer.ViewMode.Secondary && (this.primaryOverlayCloseable = t,
                    this.primaryOverlayCloseable && s || this.primaryOverlay.show(this.primaryOverlayCloseable),
                    this.secondaryOverlayCloseable = n || !d,
                    this.secondaryOverlay.show(this.secondaryOverlayCloseable),
                    this.primaryOrSecondaryOverlay.hide())) : (this.primaryOverlayCloseable = !1,
                    this.emptySessionOverlay.show()),
                    this.updateOverlayProcessing(o),
                    this.overlayShown = !0,
                    this._onShowOverlays.fire()
                }
                ,
                t.prototype.closeOverlays = function() {
                    this.primaryOverlayCloseable && (this.emptySessionOverlay.hide(),
                    this.primaryOrSecondaryOverlay.hide(),
                    this.primaryOverlay.hide()),
                    this.secondaryOverlayCloseable && this.secondaryOverlay.hide(),
                    this.overlayShown = !1,
                    this._onCloseOverlays.fire()
                }
                ,
                t.prototype.forceCloseOverlays = function() {
                    this.emptySessionOverlay.hide(),
                    this.primaryOrSecondaryOverlay.hide(),
                    this.primaryOverlay.hide(),
                    this.secondaryOverlay.hide(),
                    this.overlayShown = !1,
                    this._onCloseOverlays.fire()
                }
                ,
                t.prototype.toggleSecondaryPlaceholder = function(e) {
                    this.secondaryPlaceholder && (e ? this.secondaryPlaceholder.show() : this.secondaryPlaceholder.hide())
                }
                ,
                t.prototype.updateOverlayProcessing = function(e) {
                    this.primaryOrSecondaryOverlay.toggleProcessingStatus(e),
                    this.primaryOverlay.toggleProcessingStatus(this.filterPendingUploadsByType(e, 1)),
                    this.secondaryOverlay.toggleProcessingStatus(this.filterPendingUploadsByType(e, 2)),
                    this.secondaryPlaceholder.toggleProcessingStatus(this.filterPendingUploadsByType(e, 2))
                }
                ,
                t.sessionOverlaySelector = ".session-overlay",
                t
            }();
            t.OverlayController = o
        }(t.Controls || (t.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = function() {
                function t(e) {
                    this.contentContainer = e,
                    this.tabs = []
                }
                return t.prototype.getTabs = function() {
                    return this.attachedTabs ? $(this.attachedTabs) : $(this.tabs)
                }
                ,
                t.prototype.getSelected = function() {
                    return this.selectedContainer
                }
                ,
                t.prototype.getExpander = function() {
                    return this.expanderContainer
                }
                ,
                t.prototype.getContentContainer = function() {
                    return this.contentContainer
                }
                ,
                t.prototype.getContent = function() {
                    return this.contentContainer.children().first()
                }
                ,
                t.prototype.addTab = function(e, t) {
                    this.tabs.push(t)
                }
                ,
                t.prototype.setContentClass = function(t) {
                    this.getContent().attr("class", e.Viewer.Constants.SecondaryContentClass + " " + t)
                }
                ,
                t.prototype.setSelectedText = function(e) {
                    this.selectedText = e,
                    this.selectedContainer && this.updateSelectedText()
                }
                ,
                t.prototype.setSelectedIcon = function(e, t) {
                    this.selectedIconCode = e,
                    this.selectedIconClass = t,
                    this.selectedContainer && this.updateSelectedIcon()
                }
                ,
                t.prototype.attachTabs = function(e, t) {
                    this.selectedContainer = e,
                    this.expanderContainer = t,
                    this.updateSelectedText(),
                    this.updateSelectedIcon(),
                    this.attachedTabs = this.tabs,
                    this.expanderContainer.empty(),
                    this.expanderContainer.append(this.attachedTabs)
                }
                ,
                t.prototype.detachTabs = function() {
                    this.selectedContainer = void 0,
                    this.expanderContainer = void 0,
                    $(this.attachedTabs).remove(),
                    this.attachedTabs = void 0
                }
                ,
                t.prototype.updateSelectedText = function() {
                    this.selectedContainer.find("#selectedSecondaryText").text(this.selectedText)
                }
                ,
                t.prototype.updateSelectedIcon = function() {
                    this.selectedIconCode ? this.selectedContainer.find("#selectedSecondaryIcon").html(this.selectedIconCode).attr("class", "material-icons") : this.selectedContainer.find("#selectedSecondaryIcon").html("").attr("class", this.selectedIconClass)
                }
                ,
                t
            }();
            t.OverlayTabControlElements = n
        }(t.Controls || (t.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    var t, n, o, i;
    i = e.Viewer || (e.Viewer = {}),
    t = i.Controls || (i.Controls = {}),
    n = e.Core.Logic.Time.UneditedFirstPrimaryRelative,
    o = function() {
        function e(e, t) {
            this.viewer = e,
            this.timeConverter = t,
            this.pptExtensions = [".ppt", ".pptx"],
            this.fileProcessingRegionAnimation = $.Deferred().resolve()
        }
        return e.prototype.getStreamStartTime = function() {
            var e;
            if (this.timelineState.absoluteStart() === 1 / 0 || 0 === this.timelineState.duration())
                e = this.absoluteSessionStart;
            else {
                var t = this.timelineState.findNextTimeNotInSessionReference(this.viewer.position())
                  , o = this.timeConverter.toWin32EpochRelative(new n(t));
                e = new Date(o.milliseconds() + PanoptoCore.Constants.Win32EpochDate)
            }
            return e
        }
        ,
        e.prototype.parseEventForFirstFile = function(e) {
            var t = e.originalEvent.target.files || e.originalEvent.dataTransfer.files;
            if (t.length && t[0].size)
                return t[0]
        }
        ,
        e.prototype.parseEventForPrimaryStream = function(e) {
            var t = this.parseEventForFirstFile(e);
            if (t)
                return {
                    streamUploader: this.streamUploader,
                    file: t,
                    streamType: Panopto.Core.StreamType.PrimaryVideo,
                    startTime: this.getStreamStartTime()
                }
        }
        ,
        e.prototype.parseEventForSecondary = function(e) {
            var t = this.parseEventForFirstFile(e);
            if (t) {
                var n = Panopto.Core.StringHelpers.parseExtension(t.name);
                return _.contains(this.pptExtensions, "." + n) ? {
                    streamUploader: this.slideUploader,
                    file: t,
                    streamType: Panopto.Core.StreamType.SecondaryPresentation,
                    startTime: null
                } : {
                    streamUploader: this.streamUploader,
                    file: t,
                    streamType: Panopto.Core.StreamType.SecondaryVideo,
                    startTime: this.getStreamStartTime()
                }
            }
        }
        ,
        e.prototype.parseEventForSlides = function(e) {
            var t = this.parseEventForFirstFile(e);
            if (t)
                return {
                    streamUploader: this.slideUploader,
                    file: t,
                    streamType: Panopto.Core.StreamType.SecondaryPresentation,
                    startTime: null
                }
        }
        ,
        e.prototype.applyState = function(e) {
            this.timelineState = e
        }
        ,
        e.prototype.setAbsoluteSessionStart = function(e) {
            this.absoluteSessionStart = e
        }
        ,
        e.prototype.setStreamUploader = function(e) {
            this.streamUploader = e
        }
        ,
        e.prototype.setSlideUploader = function(e) {
            this.slideUploader = e
        }
        ,
        e.prototype.areUploadersSet = function() {
            return !!this.streamUploader && !!this.slideUploader
        }
        ,
        e.prototype.attachPrimaryTargetHandler = function(e) {
            var t = this;
            this.attachTargetHandler(e, Panopto.Core.Constants.MEDIA_UPLOAD_EXTENSIONS, (function(e) {
                return t.parseEventForPrimaryStream(e)
            }
            ))
        }
        ,
        e.prototype.attachSecondaryOrSlidesTargetHandler = function(e) {
            var t = this
              , n = Panopto.Core.Constants.MEDIA_UPLOAD_EXTENSIONS.concat(this.pptExtensions);
            this.attachTargetHandler(e, n, (function(e) {
                return t.parseEventForSecondary(e)
            }
            ))
        }
        ,
        e.prototype.attachSlidesTargetHandler = function(e) {
            var t = this;
            this.attachTargetHandler(e, this.pptExtensions, (function(e) {
                return t.parseEventForSlides(e)
            }
            ))
        }
        ,
        e.prototype.attachTargetHandler = function(e, t, n) {
            if (!this.streamUploader || !this.slideUploader)
                throw Error("streamUploader or slideUploader has not been set.");
            var o = function(e) {
                var t = n(e);
                t && t.streamUploader.startUpload(t.file, t.streamType, t.startTime)
            }
              , i = function(e) {
                e.stopPropagation(),
                e.preventDefault()
            }
              , a = function(t) {
                i(t),
                e.toggleClass("drop-target-drag")
            }
              , r = $("<input />", {
                type: "file",
                multiple: !1,
                accept: t.join(",")
            });
            r.on("change", (function(e) {
                return o(e)
            }
            )).hide().insertAfter(e),
            Panopto.Core.UI.Handlers.button(e, (function() {
                r.click()
            }
            ), {
                keyEvent: "keypress"
            }),
            _.each(["mouseover", "mouseleave", "dragover"], (function(t) {
                e.on(t, i)
            }
            )),
            _.each(["dragenter", "dragleave"], (function(t) {
                e.on(t, a)
            }
            )),
            e.on("drop", (function(e) {
                a(e),
                o(e)
            }
            ))
        }
        ,
        e
    }(),
    t.OverlayUploader = o
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
Panopto.Viewer.PlayState = Panopto.Viewer.PlayState || {},
Panopto.Viewer.PlayControls = function(e, t, n, o, i, a, r, s, l) {
    var d, c, u = PanoptoTS.Viewer.ViewMode, p = PanoptoTS.Viewer.Constants, f = Panopto.Viewer.Analytics, h = PanoptoTS.Viewer.MBRBitrate, m = Panopto.Viewer.PlayState, v = Panopto.GlobalResources, y = $("#playControlsWrapper"), P = $("#playControls"), g = $("#skipToStartButton"), S = $("#rewindButton"), C = $("#playButton"), w = $("#forwardButton"), b = $("#skipToEndButton"), T = $("#timeElapsed"), E = $("#timeRemaining"), V = $("#positionSlider"), I = $("#elapsedBar"), k = $("#volumeControl"), R = $("#volumeFlyout"), D = $("#volumeSlider"), L = $("#muteButton"), x = $("#volumeAlert"), O = $("#captionsButton"), U = $("#captionStyleOptions"), M = $("#dockedCaption"), A = $("#dockedCaptionText"), H = $("#overlayCaption"), B = $("#qualityButton"), F = B.find("#qualityBarWrapper"), N = $("#quickRewindButton"), z = $("#quickFastForwardButton"), G = $("#playSpeedButton"), j = $("#playSpeedExpander"), Q = $("#playSpeedMultiplier"), q = V.find("#positionHandle"), W = V.find("#hoverTimestamp"), K = V.find("#hoverTick"), J = $("#seekToLiveButton"), Y = $("#liveButton"), X = $("#qualityExpander"), Z = $("#captionsExpander"), ee = Z.find("#captionPlacementOptions"), te = Z.find("#captionColorOptions"), ne = Z.find("#captionSizeOptions"), oe = Z.find("#captionsToggle"), ie = $("#autoplayMessage"), ae = "fullscreen-controls", re = $("#viewer"), se = $("#absoluteControls"), le = !1;
    s.onMaximize.add((function(e) {
        var t = e ? e.getStreamPlayer() : n;
        $e(t)
    }
    )),
    s.onRestore.add((function() {
        $e(void 0)
    }
    )),
    s.onSwap.add((function() {
        var t = a.getPrimaryPlayerIndex() === a.PrimaryDefaultIndex ? 0 : a.PrimaryDefaultIndex;
        e.swapLeftToRight(t)
    }
    ));
    var de, ce, ue, pe = $("#primaryBuffering"), fe = $("#secondaryBuffering"), he = function(e) {
        return PanoptoCore.CookieHelpers.getUserCookieField(t.user.key, e)
    }, me = function(e, n) {
        PanoptoCore.CookieHelpers.setUserCookieField(t.user.key, e, n)
    }, ve = he(p.CaptionsCookie), ye = "boolean" == typeof ve ? ve : Panopto.viewer.captionsEnabledByDefault, Pe = he(p.CaptionPlacementCookie), ge = he(p.CaptionSizeCookie), Se = he(p.CaptionColorCookie), Ce = null !== Pe && null !== ge && null !== Se ? new PanoptoCore.Models.Settings.CaptionStyles(Pe,ge,Se) : Panopto.Captions.selectedStyles, we = !1, be = !1, Te = PanoptoViewer.PlaySpeed.Normal, Ee = t.flowPlayerEnabled ? "vertical" : "horizontal", Ve = 0, _e = t.duration, Ie = "video, .fp-ui, .slide-deck #slideDeck-image", ke = "#primaryPlayer, .secondaryPlayer", Re = function() {
        return Ce.placement === PanoptoCore.Models.Settings.CaptionPlacement.Docked
    }, De = function() {
        var t = _.find(Panopto.Captions.ColorOptions, (function(e) {
            return e.key === Ce.colorSchemeKey
        }
        ));
        M.add(H).css({
            "font-size": Ce.textSize + "px",
            color: t.color,
            "text-shadow": t.textShadow
        }),
        M.css({
            height: 3 * Ce.textSize,
            "border-color": t.dockedBorderColor,
            "background-color": t.dockedBackgroundColor
        }),
        A.css({
            "max-height": 3 * Ce.textSize
        }),
        H.css({
            opacity: t.overlayOpacity,
            "background-color": t.backgroundColor
        }),
        e.setCaptionStyles(Ce);
        var n = function(e, t) {
            e.children().each((function(e, n) {
                var o = $(n).data("value") === t;
                $(n).toggleClass(Panopto.Core.Constants.SelectedClass, o).attr("aria-checked", String(o))
            }
            ))
        };
        e.isFullscreen() ? n(ee, PanoptoCore.Models.Settings.CaptionPlacement.Overlay) : n(ee, Ce.placement),
        n(te, Ce.colorSchemeKey),
        n(ne, Ce.textSize)
    }, Le = function() {
        me(p.CaptionPlacementCookie, Ce.placement),
        me(p.CaptionColorCookie, Ce.colorSchemeKey),
        me(p.CaptionSizeCookie, Ce.textSize),
        De(),
        e.synchronize(),
        e.resize()
    }, xe = function() {
        return t.flowPlayerEnabled || Te === PanoptoViewer.PlaySpeed.Normal
    }, Oe = function() {
        return xe() && we || be
    }, Ue = function(e, t, o) {
        n.bitrate(e),
        _.each(r, (function(t) {
            var n = t.getCurrentPlayer();
            n && n.bitrate(e)
        }
        )),
        _.each(PanoptoTS.Viewer.EnumHelpers.getNameValuePairs(PanoptoTS.Viewer.MBRBitrate), (function(t) {
            $("#" + t.key).toggleClass(Panopto.Core.Constants.SelectedClass, t.value === e).attr("aria-checked", (t.value === e).toString())
        }
        )),
        t && me(o, e)
    }, Me = function(e) {
        var t = n.isMuted();
        L.toggleClass("muted", t),
        L.attr("title", t ? v.ViewerPlus_Unmute : v.ViewerPlus_Mute),
        e && D.slider("value", n.volume())
    }, Ae = function(e, t, o) {
        e = Panopto.Core.ElementHelpers.clampSliderValue(D, e),
        o && f.sendEvent({
            action: n.volume() < e ? f.Actions.VolumeUp : f.Actions.VolumeDown,
            label: o
        });
        var i = "horizontal" === Ee ? "width" : "height";
        $("#volumeLevel").css(i, e + "%"),
        n.setVolume(e),
        Me(!1),
        t && D.slider("value", e),
        me(p.VolumeCookie, e)
    }, He = function(e) {
        I.css("width", 100 * e / V.slider("option", "max") + "%")
    }, Be = function(e, t, n) {
        var o;
        e = "number" == typeof t ? _e * (t / V.width()) : e,
        e = Math.round(Panopto.Core.ElementHelpers.clampSliderValue(V, e));
        try {
            o = J.is(":hover")
        } catch (e) {
            o = !1
        }
        var i = o || n ? v.ViewerPlus_Live : Panopto.Core.TimeHelpers.formatDuration(e, v.TimeSeparator)
          , a = q.offset().left - q.parent().offset().left
          , r = a + q.outerWidth();
        W.text(i),
        W.show(),
        void 0 !== t ? (t = Math.clamp(t, 0, V.width()),
        W.css("left", t >= a && t <= r ? r : t - W.width() / 2),
        K.show().css("left", t),
        K.toggleClass("accent-tick", K.offset().left < q.offset().left)) : (W.css("left", e / _e * V.width() + q.outerWidth(!0)),
        K.hide())
    }, Fe = function() {
        O.add(oe).toggleClass("safety-text", ye);
        var e = ye ? v.ViewerPlus_Captions_Hide : v.ViewerPlus_Captions_Show;
        O.attr({
            title: e,
            "aria-label": e,
            "aria-pressed": ye
        })
    }, $e = function(o) {
        e.setFullscreenPlayer(o),
        Panopto.viewer.viewerWatermarkPosition && (0 === $("#absoluteControls").find(".logo-while-playing").length && (c = new PanoptoViewer.WatermarkLogo(Panopto.branding.embedLogo.png,Panopto.viewer.viewerWatermarkPosition),
        $("#absoluteControls #fullscreenControlsWrapper").append(c.getBrandElem())),
        Panopto.viewer.viewerWatermarkPosition !== PanoptoViewer.Data.ViewerWatermarkPositionOptions.TopLeft && c.setOffset(50)),
        t.flowPlayerEnabled && Panopto.Core.Browser.fullscreenEnabled && (o ? (0 === se.find(P).length && (P.addClass(ae),
        P.children().not("#transportControls").hide(),
        $("#fullscreenControlsWrapper").prepend(P),
        $("#fullscreenControlsWrapper").show()),
        o.container().find(Ie).parent().append(se)) : (0 === y.find(P).length && (P.removeClass(ae).show(),
        P.children().not("#transportControls").hide(),
        $("#fullscreenControlsWrapper").hide(),
        y.append(P)),
        re.append(se)));
        var i = void 0 !== o
          , a = o === n;
        s.updateFullscreenButtons({
            allowFullscreen: !0,
            isFullscreen: i
        }),
        i ? (s.toggleSwap(!1),
        Ce.placement === PanoptoCore.Models.Settings.CaptionPlacement.Docked && (ee.find(".Docked").removeClass("selected"),
        ee.find(".Overlay").addClass("selected"))) : De(),
        s.hide({
            animate: !1
        }),
        pe.css("z-index", a || !i ? "" : -1),
        fe.css("z-index", a && i ? -1 : ""),
        e.synchronize()
    }, Ne = function(e) {
        PanoptoCore.forEachEnum(PanoptoViewer.PlaySpeed, (function(t, n) {
            var o = n === e;
            $("#" + t).toggleClass(Panopto.Core.Constants.SelectedClass, o).attr("aria-checked", String(o)),
            o && Q.text(v[p.PlaySpeedResourceString.format(t)])
        }
        )),
        G.toggleClass("fast", e > PanoptoViewer.PlaySpeed.Normal)
    }, ze = function(e) {
        t.isBroadcast && n.isLive() && e > PanoptoViewer.PlaySpeed.Normal && (e = PanoptoViewer.PlaySpeed.Normal),
        Te = e,
        n.playSpeed(e);
        for (var o = 0, i = r; o < i.length; o++)
            for (var a = 0, s = i[o].getTabs(); a < s.length; a++) {
                s[a].playSpeed(Te)
            }
        Ne(Te),
        j.hide(),
        G.focus(),
        B.toggleClass("disabled", !xe()),
        xe() || B.attr("title", v.ViewerPlus_QualityDisabled),
        f.sendEvent({
            action: f.Actions.Speed,
            label: Te.toString()
        })
    };
    if (Panopto.Core.UI.Handlers.button(C, (function() {
        e.togglePlaying(f.Labels.Normal)
    }
    )),
    C.toggleClass("pause-disabled", e.isDVRDisabled()),
    Panopto.Core.UI.Handlers.button(g, (function() {
        e.skipToStart(f.Labels.Normal)
    }
    )),
    Panopto.Core.UI.Handlers.button(S, (function() {
        e.rewind(f.Labels.Normal, p.EditJumpSeconds)
    }
    )),
    S.attr("title", PanoptoTS.StringHelpers.format(v.ViewerPlus_Rewind, p.EditJumpSeconds)),
    Panopto.Core.UI.Handlers.button(w, (function() {
        e.forward(f.Labels.Normal, p.EditJumpSeconds)
    }
    )),
    w.attr("title", PanoptoTS.StringHelpers.format(v.ViewerPlus_Forward, p.EditJumpSeconds)),
    Panopto.Core.UI.Handlers.button(b, (function() {
        e.skipToEnd(f.Labels.Normal)
    }
    )),
    Panopto.Core.UI.Handlers.button(N, (function() {
        e.rewind(f.Labels.Normal)
    }
    )),
    N.attr("title", PanoptoTS.StringHelpers.format(v.ViewerPlus_Rewind, p.QuickRewindSeconds)),
    e.userSeekEnabled() || N.hide(),
    Panopto.Core.UI.Handlers.button(z, (function() {
        e.forward(f.Labels.Normal, 10)
    }
    )),
    z.attr("title", PanoptoTS.StringHelpers.format(v.ViewerPlus_FastForward, 10)),
    e.userSeekEnabled() || z.hide(),
    V.mousemove((function(t) {
        !ce && e.userSeekEnabled() && (Ve = t.clientX - V.offset().left,
        Be(0, Ve, !1),
        ue = !0)
    }
    )).mouseleave((function() {
        ce || (W.hide(),
        K.hide(),
        ue = !1)
    }
    )),
    q.mouseup((function(t) {
        if (e.userSeekEnabled()) {
            var n = t.clientX - V.offset().left;
            Math.abs(n - Ve) <= p.SliderDragThreshold && (d = t.clientX,
            e.setPosition(n / V.width() * _e))
        }
    }
    )),
    k.addClass(Ee),
    "vertical" === Ee && k.find(".ui-slider-handle").on("keydown keyup", (function(e) {
        e.keyCode === Panopto.Core.Key.Home ? e.keyCode = Panopto.Core.Key.End : e.keyCode === Panopto.Core.Key.End && (e.keyCode = Panopto.Core.Key.Home)
    }
    )),
    Panopto.Core.UI.Handlers.hoverOrDrag(k, (function(e) {
        le && (e = !1),
        e ? (k.toggleClass("active", !0),
        R.fadeIn(p.FadeInterval)) : R.fadeOut(p.FadeInterval, (function() {
            k.toggleClass("active", !1),
            R.show()
        }
        ))
    }
    )),
    Panopto.Core.UI.Handlers.key(k, (function() {
        k.toggleClass("active", !1)
    }
    ), [Panopto.Core.Key.Esc]),
    D.slider({
        max: 100,
        min: 0,
        value: p.InitialVolume,
        step: 1,
        orientation: Ee,
        change: function(e, t) {
            var n = e;
            Ae(t.value, !1, !!n.originalEvent && f.Labels.Normal)
        },
        slide: function(e, t) {
            Ae(t.value, !1, void 0)
        }
    }),
    Panopto.Core.UI.Accessibility.slider(D, (function(e) {
        return PanoptoTS.StringHelpers.format(v.ViewerPlus_ARIA_PercentValue, e)
    }
    ), v.Viewer_Aria_VolumeSlider),
    Panopto.Core.UI.Handlers.button(L, (function() {
        e.toggleMuted(f.Labels.Normal)
    }
    )),
    L.on("keydown keyup", (function(e) {
        e.keyCode >= 33 && e.keyCode <= 40 && D.find(".ui-slider-handle").trigger(e)
    }
    )),
    Ae("number" == typeof o ? o : p.InitialVolume, !0, void 0),
    V.slider({
        max: _e,
        min: 0,
        value: 0,
        step: 1,
        orientation: "horizontal",
        disabled: !e.userSeekEnabled(),
        change: function(t, o) {
            var i, a = t, r = Panopto.Core.ElementHelpers.clampSliderValue(V, o.value);
            if (ce = !1,
            He(r),
            a.originalEvent) {
                if (q.hide(),
                (i = $(document.elementFromPoint(a.clientX || 0, a.clientY || 0))).is(".timeline-event"))
                    i.click();
                else if (void 0 !== a.clientX) {
                    if (a.clientX !== d) {
                        d = a.clientX;
                        var s = (a.clientX - V.offset().left) / V.width() * _e;
                        s = Math.max(0, s),
                        e.setPosition(s)
                    }
                } else
                    e.setPosition(r);
                q.show(),
                n.setPlayStateWithLogging(e.playState(), !0),
                K.hide(),
                W.hide(),
                f.sendEvent({
                    action: f.Actions.Seek,
                    label: f.Labels.Normal
                })
            } else
                ue && Be(0, Ve, !1)
        },
        slide: function(e, t) {
            var o = Panopto.Core.ElementHelpers.clampSliderValue(V, t.value);
            ce = !0,
            n.playState(m.Paused),
            _.each(r, (function(e) {
                var t = e.getCurrentPlayer();
                t && t.playState(m.Paused)
            }
            )),
            Be(o, void 0, !1),
            He(o)
        }
    }),
    Panopto.Core.UI.Accessibility.slider(V, (function(e) {
        return Panopto.Core.TimeHelpers.formatDuration(e, v.TimeSeparator)
    }
    ), v.Viewer_Aria_PositionSlider),
    e.userSeekEnabled() || (V.css("pointer-events", "none"),
    q.attr("tabindex", -1)),
    t.isBroadcast && (Y.show(),
    J.show(),
    e.userSeekEnabled() ? (Panopto.Core.UI.Handlers.button(J.add(Y), (function() {
        n.isLive() || (e.setPlayState(m.Playing, void 0, void 0),
        n.setIsLive(!0, (function() {
            e.synchronize(!0)
        }
        )))
    }
    )),
    J.focus((function() {
        Be(0, J.position().left + J.width() / 2, !0)
    }
    ))) : (Y.addClass("seek-disabled"),
    Y.add(J).attr("tabindex", -1))),
    Panopto.viewer.userCaptionControlsEnabled) {
        var Ge = "optionsVisible";
        Panopto.Core.UI.Components.flyout({
            $element: Z,
            $trigger: U,
            timeout: p.FlyoutTimeout,
            expandLeft: !0,
            expandUp: !0,
            fadeInterval: p.FadeInterval,
            showCallback: function() {
                U.hasClass(Ge) || (U.addClass(Ge),
                $("#captionStylesPartialBorder").css("width", U.innerWidth()),
                Panopto.Core.Browser.flashEnabled() && e.toggleScreens(!1))
            },
            hideCallback: function() {
                U.hasClass(Ge) && (U.removeClass(Ge),
                Panopto.Core.Browser.flashEnabled() && e.toggleScreens(!0))
            }
        }),
        _.each(Panopto.Captions.PlacementOptions, (function(e) {
            ee.append(_.template($("#placementOptionTemplate").html())(e))
        }
        )),
        Panopto.Core.UI.Handlers.button(ee.children(), (function(e) {
            Ce.placement = $(e).data("value"),
            Le()
        }
        )),
        _.each(Panopto.Captions.ColorOptions, (function(e) {
            te.append(_.template($("#colorOptionTemplate").html())(e))
        }
        )),
        Panopto.Core.UI.Handlers.button(te.children(), (function(e) {
            Ce.colorSchemeKey = $(e).data("value"),
            Le()
        }
        )),
        _.each(Panopto.Captions.SizeOptions, (function(e) {
            ne.append(_.template($("#sizeOptionTemplate").html())(e))
        }
        )),
        Panopto.Core.UI.Handlers.button(ne.children(), (function(e) {
            Ce.textSize = $(e).data("value"),
            Le()
        }
        ))
    }
    if (Panopto.Core.UI.Handlers.button(O, (function() {
        ye = !ye,
        me(p.CaptionsCookie, ye),
        Fe(),
        e.synchronize()
    }
    )),
    Z.find("li").attr("tabindex", U.attr("tabindex")),
    t.requiresSilverlight && !Silverlight.isInstalled(p.PlaySpeedSilverlightVersion) || !t.playSpeedEnabled ? G.hide() : (Panopto.Core.UI.Components.flyout({
        $element: j,
        $trigger: G,
        timeout: p.FlyoutTimeout,
        expandLeft: !0,
        expandUp: !1,
        fadeInterval: p.FadeInterval,
        showCallback: function() {
            le = !0
        },
        hideCallback: function() {
            le = !1
        }
    }),
    j.find(".flyout-close").before(_.template($("#playSpeedTemplate").html())({
        playSpeeds: PanoptoCore.mapEnum(PanoptoViewer.PlaySpeed, (function(e, t) {
            return {
                text: v[p.PlaySpeedResourceString.format(e)],
                id: e,
                speedClass: (t > PanoptoViewer.PlaySpeed.Normal ? "fast" : "") + (t === PanoptoViewer.PlaySpeed.Fastest ? " fastest" : "")
            }
        }
        ))
    })),
    Ne(Te),
    Panopto.Core.UI.Handlers.button(j.find(".play-speed"), (function(e) {
        var t = PanoptoViewer.PlaySpeed[e.id];
        ze(t)
    }
    )),
    e.userSeekEnabled() || G.hide()),
    t.multiBitrateEnabled) {
        Panopto.Core.UI.Components.flyout({
            $element: X,
            $trigger: B,
            timeout: p.FlyoutTimeout,
            expandLeft: !0,
            expandUp: !1,
            fadeInterval: p.FadeInterval,
            condition: function() {
                return Oe()
            }
        }),
        $("#qualityOptionHeader").after(_.template($("#qualityOptionTemplate").html())({
            qualityOptions: _.map(PanoptoTS.Viewer.EnumHelpers.getNames(PanoptoTS.Viewer.MBRBitrate), (function(e) {
                return {
                    text: v[p.BitrateResourceString.format(e)],
                    id: e
                }
            }
            ))
        })),
        Panopto.Core.UI.Handlers.button(X.find(".quality-option"), (function(e) {
            var n = h[e.id];
            Ue(n, !0, t.requiresSilverlight ? p.BitrateCookie : p.MBRBitrateCookie),
            X.hide(),
            B.focus(),
            f.sendEvent({
                action: f.Actions.Bitrate,
                label: _.invert(h)[n].toLowerCase()
            })
        }
        ));
        var je = PanoptoTS.Viewer.Logic.InitialStateLogic.getBitrate(t.requiresSilverlight);
        Ue(je, void 0, void 0)
    } else
        B.hide();
    $(document).keydown((function(t) {
        $(t.target).closest("#detailsTab, #editDetailsTab, .MuiDialog-root, #threadedComments").length || e.hotkey(t.keyCode)
    }
    )),
    $(document).on("dblclick", ke, (function(e) {
        var t = a.getPlayerFromElement($(e.currentTarget));
        t.isFullscreen && t.setIsFullscreen && $e(t.isFullscreen() ? void 0 : t)
    }
    )),
    se.on("dblclick", (function(e) {
        return e.stopPropagation()
    }
    ));
    var Qe, qe = function(t) {
        t.css("cursor", "default"),
        clearTimeout(Qe),
        Qe = window.setTimeout((function() {
            t.css("cursor", "none"),
            $(".fullscreen-controls").finish().fadeOut(p.FadeInterval),
            c && c.setOffset(0)
        }
        ), 1e3 * p.FullScreenControlInterval);
        var n = a.getPlayerFromElement(t);
        if (Panopto.viewer.allowMultipleSecondaryDisplay) {
            var o = _.chain(r).filter((function(e) {
                return e.getCurrentPlayer() === n
            }
            )).first().value();
            o ? (o.getTabControl().updateAvailableTabs(e.position()),
            s.showTabsFor(o)) : s.showTabsFor(void 0)
        } else
            r.length && (r[0].getCurrentPlayer() === n ? s.setSecondaryContentContainer(r[0]) : s.setSecondaryContentContainer(void 0));
        var i = n && n.container().is(".slide-deck");
        if (s.updateFullscreenButtons({
            allowFullscreen: !i,
            isFullscreen: e.isFullscreen()
        }),
        s.toggleSwap(e.isSecondarySwapAllowed()),
        s.show(t),
        e.isFullscreen()) {
            $(".fullscreen-controls").fadeIn(p.FadeInterval);
            var l = Panopto.viewer.viewerWatermarkPosition !== PanoptoViewer.Data.ViewerWatermarkPositionOptions.TopLeft;
            c && l && c.setOffset(50),
            $(".fullscreen-controls").on("mouseover", (function() {
                clearTimeout(Qe)
            }
            ))
        }
    }, We = function() {
        ie.css({
            left: C.offset().left + C.outerWidth() / 2,
            top: C.offset().top - ie.outerHeight() - 24
        })
    };
    return $(document).on("mousemove", ke, (function(e) {
        qe($(e.currentTarget).find(Ie).first())
    }
    )),
    $(document).on("keydown", (function(e) {
        "Tab" === e.key && qe($(Ie).last())
    }
    )),
    a.onPlayerSwap((function(e, t) {
        var n = s.getCurrentTarget();
        if (n) {
            var o = 0 !== n.closest("." + p.SecondaryPlayerClass).length ? i.getPrimaryPlayer() : $(i.getSecondaryPlayers().get(e));
            qe(o.find(Ie))
        }
    }
    )),
    $(document).on("click", "video", (function() {
        e.togglePlaying()
    }
    )),
    $(document).on("contextmenu", "video", (function() {
        return !1
    }
    )),
    Panopto.Core.Browser.fullscreenEvent((function(e) {
        t.flowPlayerEnabled && Panopto.Core.Browser.fullscreenEnabled && !e ? $e(void 0) : e || (s.hide(),
        $(".fullscreen-controls").fadeOut(p.FadeInterval))
    }
    )),
    Z.on("keydown", (function(e) {
        var t = Z.find("li")
          , n = t.first()[0]
          , o = t.last()[0];
        e.keyCode === Panopto.Core.Key.Tab && (e.shiftKey ? document.activeElement === n && (o.focus(),
        e.preventDefault()) : document.activeElement === o && (n.focus(),
        e.preventDefault()))
    }
    )),
    E.toggle(!t.isBroadcast),
    De(),
    Fe(),
    Panopto.viewer.allowMultipleSecondaryDisplay && !l && (new PanoptoTS.Viewer.Controls.SecondaryLayoutSelector($("#selectedSecondaryLayout"),$("#secondaryLayoutExpander"),a,v),
    $("#selectedSecondary").hide()),
    {
        synchronize: function(e, o, i, a, r) {
            o > 0 && o != _e && (_e = o,
            V.slider("option", "max", _e),
            V.find(".ui-slider-handle").attr("aria-valuemax", _e)),
            Math.abs(e - _e) < .1 && (e = _e),
            ce || V.slider("value", e),
            T.text(i),
            E.text(a),
            t.isBroadcast && (Y.toggleClass("live", n.isLive()),
            Y.attr("title", n.isLive() ? "" : v.ViewerPlus_Live_Tooltip),
            Y.css("cursor", n.isLive() ? "" : "pointer"),
            J.toggleClass("accent-background", n.isLive()),
            J.toggleClass("safety-accent-border-ifcustom", n.isLive()))
        },
        synchronizeCaption: function(n) {
            var o = !!t.hasCaptions
              , i = M.is(":visible");
            O.toggle(o || n && t.isBroadcast),
            U.toggle(o && Panopto.viewer.userCaptionControlsEnabled),
            M.toggle(o && Re() && ye),
            i !== M.is(":visible") && e.resize(),
            a.getLeftPlayerElement().find(".letterbox").toggleClass("no-border-radius", M.is(":visible") && e.viewMode() === u.Primary),
            a.getRightPlayerElements().toggleClass("no-border-radius", M.is(":visible") && e.viewMode() === u.Secondary)
        },
        synchronizeBitrate: function() {
            var o, i, a = _.map(r, (function(e) {
                return e.getCurrentPlayer()
            }
            )), s = _.filter(a, (function(e) {
                return e && e.hasMBR()
            }
            ));
            switch (e.viewMode()) {
            case u.Primary:
                o = n;
                break;
            case u.Secondary:
            default:
                o = s.length ? _.min(s, (function(e) {
                    return e.bitrateLevelOffset()
                }
                )) : n
            }
            we = o.hasMBR(),
            i = Math.max(p.BitrateLevels.length + o.bitrateLevelOffset() - 1, 0),
            F.attr("class", "bar-" + i),
            xe() && B.attr("title", we ? PanoptoTS.StringHelpers.format(v.ViewerPlus_YourConnection, p.BitrateLevels[i]) : v.ViewerPlus_OnlyOneBitrate),
            n.optimizationProvider() && !be ? (be = !0,
            n.optimizationProvider() === p.Kollective ? (!t.isBroadcast || t.flowPlayerEnabled || Panopto.viewer.kollectiveVideoJSWebcastDVREnabled || (N.hide(),
            z.hide(),
            C.hide()),
            $("#qualityOptionHeader").text(v.ViewerPlus_OptimizedStream_Kollective)) : n.optimizationProvider() === p.Hive && $("#qualityOptionHeader").text(v.ViewerPlus_OptimizedStream_Hive)) : be && !n.optimizationProvider() && $("#qualityOptionHeader").text(v.ViewerPlus_Quality),
            B.toggleClass(Panopto.Core.Constants.DisabledClass, !Oe())
        },
        setBitrate: Ue,
        toggleMuted: function() {
            var e = !n.isMuted();
            n.muted(e),
            Me(!0);
            var t = e ? v.ViewerPlus_ARIA_Muted : v.ViewerPlus_ARIA_Unmuted;
            x.text(t)
        },
        updateVolume: Ae,
        showVolumeControl: function() {
            k.mouseenter(),
            de && clearTimeout(de),
            de = setTimeout((function() {
                k.mouseleave()
            }
            ), p.FlyoutTimeout)
        },
        togglePlayState: function(e) {
            C.toggleClass("paused", e),
            C.attr("title", e ? v.ViewerPlus_Play : v.ViewerPlus_Pause)
        },
        toggleAutoplayMessage: function(e) {
            ie.toggle(e),
            e && We()
        },
        positionAutoplayMessage: We,
        playSpeed: function() {
            return Te
        },
        setPlaySpeed: ze,
        captionsSelected: function() {
            return ye
        },
        captionsDocked: Re,
        onUserSeekEnabledChanging: function(e) {
            e ? (N.show(),
            z.show(),
            V.slider("enable"),
            V.css("pointer-events", "auto"),
            q.attr("tabindex", 0),
            G.show()) : (N.hide(),
            z.hide(),
            V.slider("disable"),
            V.css("pointer-events", "none"),
            q.attr("tabindex", -1),
            G.hide())
        }
    }
}
,
function(e) {
    !function(e) {
        !function(t) {
            var n = PanoptoCore.VoidCallback
              , o = PanoptoCore.TypedCallback
              , i = function() {
                function t(e) {
                    var t = this;
                    this._onMaximize = new o,
                    this._onRestore = new n,
                    this._onSwap = new n,
                    this._onShowOverlay = new n,
                    this.template = _.template('\n            <div class="player-layout-controls">\n                <div\n                    class="show-overlay-button"\n                    tabindex="0"\n                    aria-label="' + Panopto.GlobalResources.Viewer_ShowOverlay + '">\n                    <i class="material-icons">&#xE145;</i>\n                </div>\n                <div\n                    class="full-screen-button"\n                    tabindex="0"\n                    aria-label="' + Panopto.GlobalResources.Viewer_FullScreen + '">\n                    <i class="material-icons">&#xE5D0;</i>\n                </div>\n                <div\n                    class="restore-screen-button"\n                    tabindex="0"\n                    aria-label="' + Panopto.GlobalResources.Viewer_RestoreScreen + '">\n                    <i class="material-icons">&#xE5D1;</i>\n                </div>\n                <div\n                    class="swap-streams-button"\n                    tabindex="0"\n                    aria-label="' + Panopto.GlobalResources.Viewer_SwapStreams + '">\n                    <i class="material-icons">&#xE8D4;</i>\n                </div>\n                <div id="secondaryContainer" class="select-secondary-container">\n                    <div\n                        class="selected-secondary"\n                        tabindex="0"\n                        role="button"\n                        aria-haspopup="true"\n                        aria-label="' + Panopto.GlobalResources.Viewer_SecondaryStreamMenu + '">\n                        <div id="selectedSecondaryWrapper" class="player-tab-wrapper">\n                            <i id="selectedSecondaryIcon" class="material-icons"></i>\n                            <div id="selectedSecondaryText" class="player-tab-title ellipsis"></div>\n                            <i class="material-icons">arrow_drop_down</i>\n                        </div>\n                    </div>\n                    <div\n                        class="select-secondary-flyout"\n                        role="menu"\n                        aria-orientation="vertical"\n                        aria-label="' + Panopto.GlobalResources.Viewer_SecondaryStreamMenu + '">\n                        \x3c!-- templated secondary tabs go here --\x3e\n                    </div>\n                </div>\n            </div>\n        '),
                    this.isFullscreen = !1,
                    this.allowShowOverlayButton = !1,
                    this.element = $(this.template()),
                    this.fullScreenButton = $(".full-screen-button", this.element).hide(),
                    this.restoreScreenButton = $(".restore-screen-button", this.element).hide(),
                    this.swapStreamsButton = $(".swap-streams-button", this.element).hide(),
                    this.showOverlayButton = $(".show-overlay-button", this.element).hide(),
                    this.selectSecondaryContainer = $(".select-secondary-container", this.element).hide(),
                    this.selectedSecondary = $(".selected-secondary", this.element),
                    this.selectSecondaryFlyout = $(".select-secondary-flyout", this.element).hide(),
                    Panopto.Core.UI.Handlers.button(this.fullScreenButton, (function() {
                        t._onMaximize.fire(t.attachedSecondaryContentContainer)
                    }
                    )),
                    Panopto.Core.UI.Handlers.button(this.restoreScreenButton, (function() {
                        t._onRestore.fire()
                    }
                    )),
                    Panopto.Core.UI.Handlers.button(this.swapStreamsButton, (function() {
                        t._onSwap.fire()
                    }
                    )),
                    Panopto.Core.UI.Handlers.button(this.showOverlayButton, (function() {
                        t._onShowOverlay.fire()
                    }
                    )),
                    null != e && e.onAddContentRequirementChanged.add((function(e) {
                        t.allowShowOverlayButton = e.canAddContent
                    }
                    ))
                }
                return Object.defineProperty(t.prototype, "onMaximize", {
                    get: function() {
                        return this._onMaximize
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "onRestore", {
                    get: function() {
                        return this._onRestore
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "onSwap", {
                    get: function() {
                        return this._onSwap
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "onShowOverlay", {
                    get: function() {
                        return this._onShowOverlay
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                t.prototype.getCurrentTarget = function() {
                    return this.currentTarget
                }
                ,
                t.prototype.updateFullscreenButtons = function(e) {
                    var t = e.allowFullscreen
                      , n = e.isFullscreen;
                    this.fullScreenButton.toggle(!n && t),
                    this.restoreScreenButton.toggle(n),
                    this.showOverlayButton.toggle(this.allowShowOverlayButton && !n),
                    this.isFullscreen !== n && (this.isFullscreen = n,
                    this.currentTarget = void 0,
                    this.element.detach())
                }
                ,
                t.prototype.toggleSwap = function(e) {
                    this.swapStreamsButton.toggle(e)
                }
                ,
                t.prototype.show = function(t) {
                    var n = $.Deferred();
                    if (this.currentTarget && this.currentTarget[0] === t[0])
                        n.resolve();
                    else {
                        this.currentTarget = t;
                        var o = void 0;
                        o = this.isFullscreen ? this.currentTarget.parent() : this.currentTarget.closest(".player-layout-controls-container"),
                        this.element.appendTo(o),
                        this.element.finish().fadeIn(e.Constants.FadeInterval, (function() {
                            n.resolve()
                        }
                        )),
                        t.is("#slideDeck-image") && this.fullScreenButton.hide()
                    }
                    return this.setAutoHideTimeout(),
                    n.promise()
                }
                ,
                t.prototype.setSecondaryContentContainer = function(e) {
                    this.attachedSecondaryContentContainer = e
                }
                ,
                t.prototype.showTabsFor = function(e) {
                    e !== this.attachedSecondaryContentContainer && (this.attachedSecondaryContentContainer && this.attachedSecondaryContentContainer.getTabControlElements().detachTabs(),
                    this.attachedSecondaryContentContainer = e,
                    this.attachedSecondaryContentContainer ? (this.attachedSecondaryContentContainer.getTabControlElements().attachTabs(this.selectedSecondary, this.selectSecondaryFlyout),
                    this.attachedSecondaryContentContainer.getTabControl().attachTabHandlers(),
                    this.selectSecondaryContainer.show()) : this.selectSecondaryContainer.hide())
                }
                ,
                t.prototype.hide = function(t) {
                    var n = this
                      , o = (void 0 === t ? {} : t).animate
                      , i = void 0 === o || o
                      , a = $.Deferred();
                    return this.currentTarget = void 0,
                    i ? this.element.finish().fadeOut(e.Constants.FadeInterval, (function() {
                        n.element.detach(),
                        a.resolve()
                    }
                    )) : (this.element.finish().hide().detach(),
                    a.resolve()),
                    a.promise()
                }
                ,
                t.prototype.setAutoHideTimeout = function() {
                    var t = this;
                    clearTimeout(this.autoHideTimeout),
                    this.autoHideTimeout = window.setTimeout((function() {
                        t.element.is(":hover") || t.hide()
                    }
                    ), 1e3 * e.Constants.FullScreenControlInterval)
                }
                ,
                t
            }();
            t.PlayerLayoutControls = i
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.ScormData = function(e, t) {
    var n, o, i = PanoptoTS.Viewer.Constants, a = PanoptoCore.Logging.Logger, r = [], s = 0, l = 0, d = 0, c = function() {
        return s / e > i.ScormCompleteThreshold
    };
    if (a.info(t),
    t && (n = t.split("t"))[0].length === e) {
        for (o = 0; o < e; o++)
            r[o] = n[0].charAt(o),
            s += "x" === r[o] ? 1 : 0;
        d = parseFloat(n[1]) || 0
    }
    if (!r.length)
        for (o = 0; o < e; o++)
            r[o] = " ";
    return {
        serialize: function(e) {
            return r.join("") + "t" + e
        },
        markProgress: function(e) {
            return e = Math.min(r.length - 1, e),
            "x" !== r[e] && (r[e] = "x",
            s++,
            l++,
            !0)
        },
        segmentsWatched: function() {
            return s
        },
        completed: c,
        shouldUpdateSegments: function(e) {
            return c() || l >= 10 || l * e >= i.ScormMaxUpdateDelay
        },
        shouldUpdatePosition: function(e, t, n, o) {
            return Math.abs(e - t) > Math.min(i.ScormOffsetMultiplier * n, i.ScormMaxUpdateDelay) || e === o
        },
        lastPosition: function() {
            return d
        },
        onPositionUpdated: function() {
            l = 0
        }
    }
}
,
Panopto.Viewer.ScormControl = function(e, t) {
    var n, o = PanoptoTS.Viewer.Constants, i = PanoptoCore.Logging.Logger, a = Math.min(Math.ceil(t), o.MaxScormSegments), r = t / a, s = 0, l = 0, d = function(t) {
        if (-1 !== window.location.search.indexOf("scormlog=true")) {
            var n = new Date;
            i.verbose("percentCompleted: " + t + " at time: " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds() + "." + n.getMilliseconds())
        }
        e.reportPercentCompleted(t)
    };
    try {
        var c = (n = Panopto.Viewer.ScormData(a, SD.GetBookmark())).lastPosition();
        c && (e.position(c || 0),
        l = c);
        var u = n.segmentsWatched();
        return s = u * r,
        d(100 * c / t),
        {
            updateProgress: function(e) {
                if (0 !== e || 0 === l) {
                    var i = n.markProgress(Math.floor(e / r));
                    if (i && n.shouldUpdateSegments(r) || n.shouldUpdatePosition(e, l, r, t))
                        try {
                            SD.SetBookmark(n.serialize(e)),
                            SD.LMSSetValue(o.ScormTimeKey, Math.floor(1e3 * (n.segmentsWatched() * r - s))),
                            i && n.completed() && SD.SetReachedEnd(),
                            SD.CommitData(),
                            n.onPositionUpdated(),
                            l = e,
                            d(100 * e / t)
                        } catch (e) {}
                }
            }
        }
    } catch (e) {}
}
,
function(e) {
    !function(t) {
        !function(t) {
            var n = Panopto.Viewer.Tabs
              , o = function() {
                function t(e, t, n, o) {
                    this.viewer = n,
                    this.index = o,
                    this.tabs = new Array,
                    this.tabControlElements = e,
                    this.initializeTabs(t, n)
                }
                return t.prototype.getTabControlElements = function() {
                    return this.tabControlElements
                }
                ,
                t.prototype.getStreamPlayer = function() {
                    return this.streamPlayer
                }
                ,
                t.prototype.getCurrentPlayer = function() {
                    var e = _.find(this.tabs, (function(e) {
                        return e.selected()
                    }
                    ));
                    return e ? e.getPlayer() : void 0
                }
                ,
                t.prototype.getTabControl = function() {
                    return this.tabControl
                }
                ,
                t.prototype.getTabs = function() {
                    return this.tabs
                }
                ,
                t.prototype.remove = function() {
                    _.each(this.tabs, (function(e) {
                        e.remove()
                    }
                    ))
                }
                ,
                t.prototype.updateTabs = function(t, o, i) {
                    var a = this;
                    if (t.secondaryStreams.length && !this.streamPlayer) {
                        var r = o.playerSelection.getPlayerFactory(t);
                        this.streamPlayer = PanoptoLegacy.Viewer.Players.SecondaryStreamPlayer(this.tabControlElements.getContent(), r, this.viewer)
                    }
                    _.each(t.secondaryStreams, (function(r) {
                        var s = _.find(a.tabs, (function(e) {
                            return e.id() === r.id
                        }
                        ))
                          , l = 1e3 * Math.min(0, r.timeline[0] - i);
                        s ? s.setContent(r) : l < t.broadcastRefreshInterval && setTimeout((function() {
                            var t = n.SecondaryTab(a.tabControlElements, a.streamPlayer, r, e.Viewer.Controls.MaterialDesignIconHelpers.getStreamIconCode(r));
                            a.tabs.push(t),
                            t.render(),
                            a.tabControl.attachTabHandlers(),
                            o.toggleInlineSecondaries(),
                            o.synchronize(!0)
                        }
                        ), l)
                    }
                    ))
                }
                ,
                t.prototype.resize = function(e, t) {
                    var n = this.getCurrentPlayer();
                    if (n)
                        n.resize(e, t);
                    else {
                        var o = this.tabControlElements.getContentContainer();
                        o.width(e),
                        o.height(t)
                    }
                }
                ,
                t.prototype.reinitializeTabs = function(e, t) {
                    this.remove(),
                    this.tabs.length = 0,
                    this.initializeTabs(e, t)
                }
                ,
                t.prototype.initializeTabs = function(t, o) {
                    var i = this
                      , a = this.tabControlElements.getContent();
                    if (_.each(t.documents, (function(e) {
                        e.isPdf && i.addDocumentPlayer(a, e)
                    }
                    )),
                    _.each(t.slideDecks, (function(e) {
                        var t = PanoptoLegacy.Viewer.Players.SlidePlayer(a, e, o);
                        i.tabs.push(n.SecondaryTab(i.tabControlElements, t, e, Panopto.Core.Constants.SlideIconCode))
                    }
                    )),
                    t.secondaryStreams.length) {
                        if (!this.streamPlayer) {
                            var r = o.playerSelection.getPlayerFactory(t);
                            this.streamPlayer = PanoptoLegacy.Viewer.Players.SecondaryStreamPlayer(a, r, this.viewer)
                        }
                        var s = [];
                        _.each(t.secondaryStreams, (function(t) {
                            s.push(n.SecondaryTab(i.tabControlElements, i.streamPlayer, t, e.Viewer.Controls.MaterialDesignIconHelpers.getStreamIconCode(t)))
                        }
                        )),
                        this.tabs.sort((function(e, t) {
                            var n = e.relativeStartTime() - t.relativeStartTime();
                            return 0 === n && (n = e.absoluteStartTime() - t.absoluteStartTime()),
                            n
                        }
                        )),
                        _.each(s, (function(e) {
                            i.tabs.push(e)
                        }
                        ))
                    }
                    _.each(t.documents, (function(e) {
                        e.isPdf || i.addDocumentPlayer(a, e)
                    }
                    )),
                    _.each(this.tabs, (function(e) {
                        e.render()
                    }
                    )),
                    this.tabControl = Panopto.Viewer.SecondaryTabControl(this.tabControlElements, o, this.tabs, this.index)
                }
                ,
                t.prototype.addDocumentPlayer = function(e, t) {
                    var o = PanoptoLegacy.Viewer.Players.DocumentPlayer(e, t, this.viewer);
                    this.tabs.push(n.SecondaryTab(this.tabControlElements, o, t, t.iconCode))
                }
                ,
                t
            }();
            t.SecondaryContentContainer = o
        }(t.Controls || (t.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(n) {
            var o = function() {
                function n(e, t, n, o) {
                    var i = this;
                    this.selectedContainer = e,
                    this.expanderContainer = t,
                    this.model = n,
                    this.resources = o,
                    this.optionTemplate = _.template('\n<div class="player-tab-header transport-button accented-tab role="button" data-layout="<@= layout @>">\n    <div class="player-tab-wrapper">\n        <img src="<@= imagePath @>"/>\n        <div class="player-tab-title ellipsis"><@= text @></div>\n    </div>\n</div>'),
                    this.model.onSecondaryLayoutChanged.add((function(e) {
                        return i.onSecondaryLayoutChanged(e)
                    }
                    )),
                    this.render()
                }
                return n.prototype.onSecondaryLayoutChanged = function(e) {
                    e !== this.selectedPlayerLayout && this.renderNewSelection(e)
                }
                ,
                n.prototype.render = function() {
                    var e = this;
                    this.expanderContainer.hide(),
                    this.renderNewSelection(this.model.getSecondaryLayout()),
                    this.selectedContainer.show();
                    var n = _.map(this.model.getAllowedSecondaryLayouts(), (function(t) {
                        return e.getOptionTemplateModel(t)
                    }
                    ));
                    _.each(n, (function(t) {
                        return e.expanderContainer.append(e.optionTemplate(t))
                    }
                    )),
                    Panopto.Core.UI.Components.flyout({
                        $element: this.expanderContainer,
                        $trigger: this.selectedContainer,
                        timeout: t.Constants.FlyoutTimeout,
                        expandLeft: !0,
                        expandUp: !0,
                        fadeInterval: t.Constants.FadeInterval
                    }),
                    Panopto.Core.UI.Handlers.button(this.expanderContainer.find(".player-tab-header"), (function(t) {
                        e.model.setSecondaryLayout($(t).data("layout")),
                        e.expanderContainer.hide()
                    }
                    ))
                }
                ,
                n.prototype.renderNewSelection = function(e) {
                    this.selectedContainer.empty(),
                    this.selectedContainer.append(this.optionTemplate(this.getOptionTemplateModel(e)))
                }
                ,
                n.prototype.getOptionTemplateModel = function(t) {
                    var n, o;
                    switch (t) {
                    case e.Viewer.SecondaryLayoutType.Single:
                        n = this.resources.ViewerPlus_SecondaryLayout_Single,
                        o = "Icon_Single";
                        break;
                    case e.Viewer.SecondaryLayoutType.Double:
                        n = this.resources.ViewerPlus_SecondaryLayout_Split,
                        o = "Icon_Split";
                        break;
                    case e.Viewer.SecondaryLayoutType.Quad:
                        n = this.resources.ViewerPlus_SecondaryLayout_Quad,
                        o = "Icon_Quad"
                    }
                    return {
                        layout: t,
                        text: n,
                        imagePath: e.ImageHelpers.getImageUrl("Viewer/" + o + ".svg")
                    }
                }
                ,
                n
            }();
            n.SecondaryLayoutSelector = o
        }(t.Controls || (t.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
__extends = this && this.__extends || function() {
    var e = function(t, n) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        ,
        e(t, n)
    };
    return function(t, n) {
        if ("function" != typeof n && null !== n)
            throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function o() {
            this.constructor = t
        }
        e(t, n),
        t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype,
        new o)
    }
}();
!function(e) {
    !function(e) {
        !function(e) {
            var t = function(e) {
                function t() {
                    return null !== e && e.apply(this, arguments) || this
                }
                return __extends(t, e),
                t.prototype.show = function() {
                    e.prototype.show.call(this, !1)
                }
                ,
                t
            }(e.AddSecondaryOverlay);
            e.SecondaryPlaceholder = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.PlayState = Panopto.Viewer.PlayState || {},
Panopto.Viewer.SecondaryTabControl = function(e, t, n, o) {
    var i = PanoptoTS.Viewer.Constants
      , a = (Panopto.Viewer.PlayState,
    Panopto.Core.ViewerLogEntryType,
    function(o, i) {
        var a;
        if (_.each(n, (function(e) {
            e !== o ? e.setSelected(!1, i) : (a = !e.selected(),
            PanoptoCore.Logging.Logger.info("Secondary player started playing stream " + e.id()))
        }
        )),
        o) {
            var r = t.position();
            o.getPlayer().setStartPosition(r),
            o.setSelected(!0, i),
            o.getPlayer().setStartPosition(void 0),
            t.ensureSecondaryIsMinimized(),
            o.setPosition(r, !0, a, void 0),
            o.playState(t.playState()),
            o.content().isSecondaryPaneOnly ? t.interruptLayoutChanges(void 0) : t.restoreLayoutChanges(),
            t.resize()
        } else
            e.setSelectedText(Panopto.GlobalResources.ViewerPlus_SecondarySources),
            e.setSelectedIcon("", "")
    }
    )
      , r = function() {
        return _.find(n, (function(e) {
            return e.selected()
        }
        ))
    };
    return {
        getTabs: function() {
            return n
        },
        getIndex: function() {
            return o
        },
        selectTabById: function(e, o) {
            var s = r()
              , l = _.find(n, (function(t) {
                return t.id() === e
            }
            ));
            !l || !l.available(t.position()) || o && s.id() === i.SlideDeckId || a(l, !1)
        },
        attachTabHandlers: function() {
            var o = e.getExpander();
            if (o) {
                var r = e.getTabs()
                  , s = void 0
                  , l = function() {
                    return o.fadeOut(i.FadeInterval)
                };
                if (Panopto.viewer.allowMultipleSecondaryDisplay) {
                    var d = e.getSelected();
                    s = function() {
                        d.animate({
                            borderBottomRightRadius: "0px",
                            borderBottomLeftRadius: "0px"
                        }, i.FadeInterval / 3)
                    }
                    ,
                    l = function() {
                        d.animate({
                            borderBottomRightRadius: "5px",
                            borderBottomLeftRadius: "5px"
                        }, i.FadeInterval)
                    }
                }
                Panopto.Core.UI.Handlers.button(r, (function(e) {
                    var o = _.find(n, (function(t) {
                        return t.owns(e)
                    }
                    ))
                      , i = !1;
                    if (o && o.enabled()) {
                        var r = o.available(t.position())
                          , s = t.userSeekEnabled() && !t.isFullscreen();
                        (r || s) && ("number" == typeof o.seekTime() && t.setPosition(o.seekTime()),
                        a(o, !0),
                        i = !0)
                    }
                    i && l()
                }
                )),
                Panopto.Core.UI.Components.flyout({
                    $element: o,
                    $trigger: e.getSelected(),
                    timeout: i.FlyoutTimeout,
                    expandLeft: !0,
                    expandUp: !1,
                    fadeInterval: i.FadeInterval,
                    showCallback: s,
                    hideCallback: l
                }),
                t.toggleInlineSecondaries()
            }
        },
        selectedTab: r,
        selectSecondaryTab: a,
        updateSecondaryTabEnabledState: function(e, t) {
            _.each(n, (function(n) {
                var o = n.content().isBroadcast && !n.available(t);
                n.setEnabled(e && !o)
            }
            ))
        },
        updateAvailableTabs: function(e) {
            _.each(n, (function(t) {
                t.available(e)
            }
            ))
        }
    }
}
,
function(e) {
    !function(e) {
        !function(e) {
            var t = PanoptoCore.TypedCallback
              , n = function() {
                function e(e, n, o, i) {
                    var a = this;
                    this.params = e,
                    this.sessionsService = n,
                    this.sessionUploadManagementService = o,
                    this.multipartUploadManagerService = i,
                    this.uploadStatusQueryIntervalMilliseconds = 1e4,
                    this.useV2Upload = Panopto.features.uploadApiEnabledForStreamUpload && Panopto.features.useUploadAPIForWebUpload,
                    this.pendingUploads = {},
                    this.allPendingUploads = [],
                    this._onReady = new t,
                    this._onBeforeUpload = new t,
                    this._onUploaded = new t,
                    this._onUpdate = new t,
                    this._onComplete = new t,
                    this._onDelete = new t,
                    this.processV1Upload = function(e, t, n, o, i, r) {
                        a.multipartUploadManagerService.queueUpload({
                            file: n,
                            fileId: t.uploadId,
                            uploadUri: e.UploadTarget
                        }, o, (function() {
                            return i(e)
                        }
                        ), r),
                        a.multipartUploadManagerService.upload()
                    }
                    ,
                    this.processV2Upload = function(e, t, n, o, i, r) {
                        var s = {
                            fileId: t.uploadId,
                            file: n,
                            streamUpload: e,
                            bytesUploaded: [],
                            contentStoreOpenUrl: void 0,
                            contentStoreFileId: void 0,
                            contentStoreUploadId: void 0
                        };
                        a.multipartUploadManagerService.getOpenContentStoreUploadUrl(s, (function(t) {
                            s.contentStoreOpenUrl = t.SignedUrl,
                            s.contentStoreFileId = t.FileID,
                            s.contentStoreUploadId = t.contentStoreUploadId,
                            a.multipartUploadManagerService.queueUpload(s, o, (function() {
                                return i(e)
                            }
                            ), r),
                            a.multipartUploadManagerService.upload()
                        }
                        ), (function() {
                            return r
                        }
                        ))
                    }
                    ,
                    this.sessionUploadManagementService.setHost(window.location.origin),
                    $(window).on("beforeunload", (function() {
                        return a.multipartUploadManagerService.isRunning() ? Panopto.GlobalResources.ViewerPlus_Edit_WaitForUpload : void 0
                    }
                    ))
                }
                return Object.defineProperty(e.prototype, "onReady", {
                    get: function() {
                        return this._onReady
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "onBeforeUpload", {
                    get: function() {
                        return this._onBeforeUpload
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "onUploaded", {
                    get: function() {
                        return this._onUploaded
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "onUpdate", {
                    get: function() {
                        return this._onUpdate
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "onComplete", {
                    get: function() {
                        return this._onComplete
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "onDelete", {
                    get: function() {
                        return this._onDelete
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                e.prototype.getCurrentUploads = function() {
                    var e = this;
                    this.sessionUploadManagementService.getUploads(this.params.sessionId, (function(t) {
                        _.each(t.ProcessingUploads, (function(t) {
                            if (_.some(e.params.supportedStreamTypes, (function(e) {
                                return t.StreamType === e
                            }
                            ))) {
                                if (!e.pendingUploads.hasOwnProperty(t.ID)) {
                                    var n = {
                                        state: 1,
                                        filename: t.UserFilename,
                                        fileSize: void 0,
                                        bytesUploaded: void 0,
                                        request: new Panopto.Core.CancellableRequest,
                                        uploadId: t.ID,
                                        streamType: t.StreamType,
                                        errorMessage: void 0,
                                        startTime: e.params.showStartTime ? Panopto.Util.dateFromJSON(t.StreamStartTime) : null,
                                        iconCode: e.getIconCodeFromStreamType(t.StreamType),
                                        isComplete: !1
                                    };
                                    e.pendingUploads[t.ID] = n,
                                    e.allPendingUploads.push(n)
                                }
                                e.startProcessing(e.pendingUploads[t.ID])
                            }
                        }
                        )),
                        e._onReady.fire(e.pendingUploads)
                    }
                    ), (function() {
                        return $.noop()
                    }
                    ))
                }
                ,
                e.prototype.startUpload = function(e, t, n) {
                    var o = this
                      , i = new Panopto.Core.CancellableRequest
                      , a = new Panopto.Core.CancellableRequest
                      , r = "." + Panopto.Core.StringHelpers.parseExtension(e.name)
                      , s = {
                        state: 0,
                        filename: e.name,
                        fileSize: e.size,
                        bytesUploaded: 0,
                        request: new Panopto.Core.CancellableRequest((function() {
                            i.cancel(),
                            a.cancel()
                        }
                        )),
                        uploadId: void 0,
                        streamType: t,
                        errorMessage: void 0,
                        startTime: n,
                        iconCode: this.getIconCodeFromStreamType(t),
                        isComplete: !1
                    };
                    this.allPendingUploads.push(s);
                    var l = function(e) {
                        s.state = 1,
                        s.bytesUploaded = e,
                        o._onUpdate.fire(s)
                    }
                      , d = function(e) {
                        a = o.sessionUploadManagementService.closeUpload(e, (function() {
                            o._onUploaded.fire(s),
                            o.startProcessing(s)
                        }
                        ), c)
                    }
                      , c = function() {
                        s.state = 5,
                        o._onUpdate.fire(s)
                    };
                    _.contains(this.params.supportedExtensions, r) ? Panopto.features.uploadByteLimit && e.size > Panopto.features.uploadByteLimit ? (s.state = 4,
                    s.uploadId = _.uniqueId("file"),
                    this._onUpdate.fire(s)) : i = this.sessionUploadManagementService.openUpload({
                        sessionId: this.params.sessionId,
                        filename: e.name,
                        startTime: n,
                        streamType: t
                    }, (function(t) {
                        s.state = 1,
                        s.uploadId = t.ID,
                        o._onUpdate.fire(s),
                        o._onBeforeUpload.fire(s),
                        o.useV2Upload ? o.processV2Upload(t, s, e, l, d, c) : o.processV1Upload(t, s, e, l, d, c)
                    }
                    ), c) : (s.state = 3,
                    s.uploadId = _.uniqueId("file"),
                    this._onUpdate.fire(s))
                }
                ,
                e.prototype.cancelUpload = function(e) {
                    var t = this;
                    e.request.cancel(),
                    this.multipartUploadManagerService.cancelUpload(e.uploadId),
                    e.uploadId ? this.sessionUploadManagementService.deleteUpload(e.uploadId, (function() {
                        t._onDelete.fire(e)
                    }
                    ), (function() {
                        e.state = 7,
                        t._onUpdate.fire(e)
                    }
                    )) : this._onDelete.fire(e)
                }
                ,
                e.prototype.hasActiveUploads = function() {
                    return _.any(this.allPendingUploads, (function(e) {
                        return !e.isComplete && (0 === e.state || 1 === e.state || 2 === e.state)
                    }
                    ))
                }
                ,
                e.prototype.startProcessing = function(e) {
                    var t = this;
                    e.state = 2,
                    this._onUpdate.fire(e);
                    var n = setInterval((function() {
                        t.sessionUploadManagementService.getUpload(e.uploadId, (function(o) {
                            o.State === Panopto.Core.UploadStatus.Complete ? (clearInterval(n),
                            e.isComplete = !0,
                            t._onUpdate.fire(e),
                            t._onComplete.fire(e)) : o.State === Panopto.Core.UploadStatus.ProcessingError && (clearInterval(n),
                            t.getErrorMessage(e).then((function(n) {
                                e.state = 6,
                                e.errorMessage = n,
                                t._onUpdate.fire(e)
                            }
                            )))
                        }
                        ), (function() {
                            return $.noop()
                        }
                        ))
                    }
                    ), this.uploadStatusQueryIntervalMilliseconds)
                }
                ,
                e.prototype.getIconCodeFromStreamType = function(e) {
                    var t = Panopto.Core.Constants.ObjectVideoIconCode;
                    if (3 === e)
                        t = Panopto.Core.Constants.SlideIconCode;
                    return t
                }
                ,
                e.prototype.getErrorMessage = function(e) {
                    var t = this
                      , n = $.Deferred()
                      , o = Panopto.Core.ServiceInterface.Objects.ServiceTaskQuery({
                        filters: {
                            deliveryIDs: [this.params.sessionId],
                            includeDeliverySession: !0,
                            serviceTaskTypeIDs: [Panopto.Core.ServiceInterface.Objects.ServiceTaskTypes.UnisonPackaging, Panopto.Core.ServiceInterface.Objects.ServiceTaskKinds.UnisonEncode],
                            mostRecentServiceTaskTypeIDs: [Panopto.Core.ServiceInterface.Objects.ServiceTaskKinds.SlidePackaging, Panopto.Core.ServiceInterface.Objects.ServiceTaskKinds.MediaPackaging, Panopto.Core.ServiceInterface.Objects.ServiceTaskKinds.ViewerEncode, Panopto.Core.ServiceInterface.Objects.ServiceTaskKinds.FastPathViewerEncode, Panopto.Core.ServiceInterface.Objects.ServiceTaskKinds.PodcastEncode, Panopto.Core.ServiceInterface.Objects.ServiceTaskTypes.LegacyRecorderUpload, Panopto.Core.ServiceInterface.Objects.ServiceTaskKinds.TransferUpload, Panopto.Core.ServiceInterface.Objects.ServiceTaskKinds.CompleteUpload],
                            taskStates: [Panopto.Core.ServiceInterface.Objects.TaskState.PermanentFailure]
                        }
                    });
                    return Panopto.Util.callWebMethod({
                        methodName: "GetMatchingTaskStatusWebUI",
                        params: {
                            query: o
                        },
                        loadingIndicator: null,
                        onSuccess: function(o) {
                            var i, a = _.map(o.ServiceTaskStatuses.Results, (function(e) {
                                return Panopto.Core.ServiceInterface.Objects.ServiceTaskStatus(e)
                            }
                            ));
                            _.each(a, (function(n) {
                                n.sourceFilename === e.filename && (i = t.createMessage(n))
                            }
                            )),
                            n.resolve(i)
                        },
                        onFailure: function() {
                            n.reject()
                        }
                    }),
                    n.promise()
                }
                ,
                e.prototype.createMessage = function(e) {
                    var t = _.invert(Panopto.Core.ServiceInterface.Objects.TaskState)[e.state]
                      , n = "SessionList_" + e.taskName + "_" + t + "_Status"
                      , o = (Panopto.GlobalResources[n] || Panopto.GlobalResources.SessionList_MissingStatusString).format(void 0, e.sourceFilename);
                    if (e.subState) {
                        var i = "SubStatus_" + Panopto.Core.ServiceInterface.Objects.ServiceTaskResourceMapping(e)
                          , a = Panopto.GlobalResources[i] || Panopto.GlobalResources.SubStatus_MissingStatusString;
                        o += Panopto.GlobalResources.SubStatus_SentenceSeparator + a
                    }
                    return o
                }
                ,
                e
            }();
            e.StreamUploader = n
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
__extends = this && this.__extends || function() {
    var e = function(t, n) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        ,
        e(t, n)
    };
    return function(t, n) {
        if ("function" != typeof n && null !== n)
            throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function o() {
            this.constructor = t
        }
        e(t, n),
        t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype,
        new o)
    }
}();
!function(e) {
    !function(e) {
        !function(t) {
            var n = "StreamUploader_StartUpload"
              , o = PanoptoCore.Logging.Logger
              , i = function(e) {
                function t(t, i, a, l) {
                    var d = this;
                    o.info("Using debug StreamUploader.");
                    var c = new r(i,a)
                      , u = new s;
                    return (d = e.call(this, t, i, c, u) || this).mockSessionUploadManagement = c,
                    document.addEventListener(n, (function(e) {
                        if (e instanceof CustomEvent) {
                            var t = e.detail.streamType
                              , n = new Date;
                            d.startUpload({
                                name: "FakeFile.wmv",
                                size: 1e7
                            }, t, n)
                        }
                    }
                    )),
                    d
                }
                return __extends(t, e),
                t
            }(t.StreamUploader);
            t.StreamUploaderDebug = i;
            var a = function() {
                function e(e) {
                    this.sessionsService = e,
                    this.streams = []
                }
                return e.prototype.getAllStreams = function(e, t, n) {
                    var i = this;
                    o.verbose("MockSessions.getAllStreams (" + this.streams.length + ")"),
                    this.streams.length > 0 ? setTimeout((function() {
                        t(i.streams)
                    }
                    ), 0) : this.sessionsService.getAllStreams(e, t, n)
                }
                ,
                e.prototype.addMockStream = function(e) {
                    o.verbose("MockSessions.addMockStream");
                    var t = _.uniqueId("mockStream")
                      , n = 1e7 * Panopto.Core.TimeHelpers.currentWin32EpochTime
                      , i = Panopto.Core.ServiceInterface.Rest.Objects.Stream({
                        AbsoluteStart: n,
                        Duration: 3e8,
                        HttpUrl: "",
                        Id: t,
                        IsPrimary: 1 === e.StreamType,
                        Name: e.UserFilename,
                        ThumbnailInterval: 3e8,
                        ThumbnailUrlBase: "",
                        Type: 3,
                        TypeName: "Stream",
                        Url: "",
                        VRType: 0
                    });
                    this.streams.push(i)
                }
                ,
                e
            }();
            t.MockSessions = a;
            var r = function() {
                function e(e, t) {
                    this.sessionsService = e,
                    this.sessionUploadManagementService = t,
                    this.pendingUploads = []
                }
                return e.prototype.setHost = function(e) {
                    this.sessionUploadManagementService.setHost(e)
                }
                ,
                e.prototype.getUploads = function(e, t, n) {
                    var o = this;
                    this.pendingUploads.length > 0 ? setTimeout((function() {
                        t({
                            ProcessingUploads: _.filter(o.pendingUploads, (function(e) {
                                return e.State !== Panopto.Core.UploadStatus.Complete
                            }
                            ))
                        })
                    }
                    ), 0) : this.sessionUploadManagementService.getUploads(e, t, n)
                }
                ,
                e.prototype.getUpload = function(e, t, n) {
                    var o = !1;
                    _.each(this.pendingUploads, (function(n) {
                        n.ID === e && (o = !0,
                        setTimeout((function() {
                            t(n)
                        }
                        ), 0))
                    }
                    )),
                    o || this.sessionUploadManagementService.getUpload(e, t, n)
                }
                ,
                e.prototype.openUpload = function(e, t, n) {
                    var o = this
                      , i = {
                        ID: _.uniqueId("pendingUpload"),
                        SessionID: e.sessionId,
                        State: void 0,
                        StreamStartTime: e.startTime,
                        StreamType: e.streamType,
                        UploadTarget: void 0,
                        UserFilename: e.filename
                    };
                    return this.pendingUploads.push(i),
                    setTimeout((function() {
                        t(i)
                    }
                    ), 0),
                    setTimeout((function() {
                        i.State = Panopto.Core.UploadStatus.Complete,
                        o.sessionsService.addMockStream && o.sessionsService.addMockStream(i)
                    }
                    ), 2e3),
                    new Panopto.Core.CancellableRequest
                }
                ,
                e.prototype.deleteUpload = function(e, t, n) {
                    setTimeout((function() {
                        t()
                    }
                    ), 0)
                }
                ,
                e.prototype.closeUpload = function(e, t, n) {
                    setTimeout((function() {
                        t()
                    }
                    ), 0)
                }
                ,
                e
            }()
              , s = function() {
                function e() {
                    this.uploadQueue = 0
                }
                return e.prototype.isRunning = function() {
                    return this.uploadQueue > 0
                }
                ,
                e.prototype.queueUpload = function(e, t, n, o) {
                    var i = this
                      , a = 0
                      , r = setInterval((function() {
                        t(1e6 * ++a)
                    }
                    ), 100);
                    setTimeout((function() {
                        clearInterval(r),
                        n(e.fileId),
                        i.uploadQueue--
                    }
                    ), 1e3)
                }
                ,
                e.prototype.upload = function() {
                    $.noop()
                }
                ,
                e.prototype.cancelUpload = function(e) {
                    $.noop()
                }
                ,
                e
            }()
              , l = function(e) {
                function t(t, n) {
                    var o = e.call(this) || this;
                    return o.streamType = t,
                    o.neverFinish = n,
                    o
                }
                return __extends(t, e),
                t.prototype.typeArg = function() {
                    return n
                }
                ,
                t
            }(e.DebugEventModel);
            t.StreamUploaderStartUpload = l
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).UI = Panopto.UI || {},
Panopto.UI.Components = Panopto.UI.Components || {},
Panopto.Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
Panopto.Viewer.Controls = Panopto.Viewer.Controls || {},
Panopto.Viewer.Controls.ThumbnailStrip = function(e, t, n, o, i) {
    var a, r, s = PanoptoTS.Viewer.Constants, l = Panopto.Viewer.Analytics, d = Panopto.Core.UI.Components.scrollingHighlight(e, !1, s.ThumbnailScrollTimeout), c = function(r) {
        var c, u = a, p = [], f = 0, h = Panopto.cacheRoot + "/Images/no_thumbnail.svg", m = function() {
            f++,
            r && f === p.length && r()
        };
        a = _.map(t, (function(t) {
            var n = o ? t.editorTime : t.time;
            return t.id = t.id || _.uniqueId(),
            {
                time: n,
                timestamp: Panopto.Core.TimeHelpers.formatDuration(n, Panopto.GlobalResources.TimeSeparator),
                id: "thumbnail" + t.id + e.attr("id"),
                thumbnailId: t.id,
                src: t.queryParams ? Panopto.Core.StringHelpers.addQueryParameter(s.ThumbUrl, t.queryParams) : t.thumbnailUrl || h,
                tabId: t.tabId || (t.type === Panopto.Core.EventTargetType.PowerPoint ? PanoptoTS.Viewer.Constants.SlideDeckId : t.streamId),
                isSlide: t.isSlide,
                editable: !!o
            }
        }
        )),
        c = _.filter(u, (function(e) {
            return !_.find(a, (function(t) {
                return e.thumbnailId === t.thumbnailId
            }
            ))
        }
        )),
        _.each(a, (function(e) {
            var t = _.find(u, (function(t) {
                return e.thumbnailId === t.thumbnailId
            }
            ));
            t ? t.time !== e.time && (p.push(e),
            c.push(t)) : p.push(e)
        }
        )),
        _.each(c, (function(e) {
            $("#" + e.id).remove()
        }
        ));
        var v = _.template($("#thumbnailTemplate").html());
        _.each(a, (function(t, n) {
            if (p.indexOf(t) >= 0) {
                var o = v({
                    thumbnails: [t]
                });
                0 === n ? e.prepend(o) : n === a.length - 1 ? e.append(o) : $("#" + a[n - 1].id).after(o)
            }
        }
        ));
        var y = [];
        _.each(p, (function(e) {
            var t = 0
              , a = $("#" + e.id)
              , r = a.find(".thumbnail-buttons")
              , s = r.find(".thumbnail-edit")
              , c = r.find(".thumbnail-delete")
              , u = a.find("img");
            _.each(u, (function(e) {
                y.push(e)
            }
            )),
            u.on("load", (function() {
                a.show(),
                m()
            }
            )).on("error", (function(e) {
                $(e.currentTarget).attr("src") !== h ? t < 2 ? window.setTimeout((function() {
                    t++,
                    $(e.currentTarget).attr("src", $(e.currentTarget).attr("src"))
                }
                ), 1e3) : $(e.currentTarget).attr("src", h) : (a.width(a.height()),
                a.show(),
                m())
            }
            )),
            Panopto.Core.UI.Handlers.button(a, (function(t) {
                n.userSeekEnabled() && d.highlight(e, (function(e) {
                    n.setPosition(e.time),
                    !(e.time !== n.position()) && e.tabId && n.selectSecondaryTab(e.tabId, e.isSlide),
                    l.sendEvent({
                        action: l.Actions.Navigate,
                        label: l.Labels.Thumbnail
                    })
                }
                ))
            }
            )),
            o && (i ? r.show() : Panopto.Core.UI.Handlers.hoverableParent(a, r, (function(e) {
                r.toggle(e)
            }
            )),
            Panopto.Core.UI.Handlers.button(s, (function() {
                o.openEventDialog(e.thumbnailId)
            }
            )),
            Panopto.Core.UI.Handlers.button(c, (function() {
                o.removeEvent(e.thumbnailId)
            }
            )))
        }
        )),
        Panopto.Core.ImageHelpers.queueLoad($(y), 8)
    };
    return {
        render: c,
        position: function(e, t) {
            var n;
            e !== r && (_.each(a, (function(t) {
                t.time <= e && (n = t)
            }
            )),
            d.highlight(n, !1, t),
            r = e)
        },
        toggle: function(t) {
            e.toggle(t && a.length > 0)
        },
        thumbnails: function(e) {
            if (!e)
                return t;
            t = e,
            c()
        }
    }
}
,
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e(e, t, n) {
                    this.template = _.template('\n<div class="waiting-room-wrapper">\n    <p class="title"><@- title @></p>\n\n    <@ if (thumbnailUrl) { @>\n        <img class="thumbnail-img" src="<@- thumbnailUrl @>"/>\n    <@ } @>\n\n    <p class="description"><@= description @></p>\n    <p><@- Panopto.GlobalResources.ViewerPlus_BroadcastNotStarted @></p>\n</div>\n'),
                    this.$element = e,
                    this.delivery = t,
                    this.thumbnailUrl = n
                }
                return e.prototype.render = function() {
                    var e = Panopto.Core.TextHelpers.displayLineBreaks(_.escape(this.delivery.description))
                      , t = {
                        title: this.delivery.title,
                        description: e,
                        thumbnailUrl: this.thumbnailUrl
                    };
                    this.$element.html(this.template(t))
                }
                ,
                e.prototype.remove = function() {
                    this.$element.empty()
                }
                ,
                e.prototype.toggle = function(e) {
                    this.$element.toggle(e)
                }
                ,
                e
            }();
            e.WaitingRoom = t
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
function(e) {
    !function(t) {
        var n, o;
        n = t.Data || (t.Data = {}),
        o = function() {
            function n(t) {
                var n = Panopto.Viewer.Data
                  , o = e.Viewer.Constants
                  , i = t.Delivery.SessionName
                  , a = Panopto.Core.TimeHelpers.formatWin32EpochTimeToDate(t.Delivery.SessionStartTime)
                  , r = t.Delivery.IsActiveBroadcast
                  , s = t.Delivery.IsBroadcast && t.Delivery.IsViewerEncodeComplete && (new Date).getTime() - a.getTime() <= o.RecentBroadcastThreshold
                  , l = this.parseStreams(t.Delivery.Streams, i, r)
                  , d = l.primaryStreams
                  , c = l.secondaryStreams
                  , u = l.activePrimary
                  , p = l.screenCaptureStream
                  , f = this.parseStreams(t.Delivery.PodcastStreams, i, r).primaryStreams;
                f.forEach((function(e) {
                    return e.id = null == u ? void 0 : u.id
                }
                ));
                var h = this.parsePlayerInfo(d, u, r)
                  , m = h.multiBitrateEnabled
                  , v = h.playSpeedEnabled
                  , y = h.flowPlayerEnabled
                  , P = h.requiresSilverlight
                  , g = this.parseEvents(t.Delivery.Timestamps, t.Delivery.EventTargets, t.Delivery.PublicNotesStreams, t.Delivery.Duration, p)
                  , S = g.slides
                  , C = g.documents
                  , w = g.thumbnails
                  , b = g.contents
                  , T = g.channels;
                this.title = i,
                this.id = t.Delivery.PublicID,
                this.webcastVersionId = t.Delivery.WebcastVersionId,
                this.date = a,
                this.duration = t.Delivery.Duration,
                this.description = t.Delivery.SessionAbstract,
                this.ownerId = t.Delivery.OwnerId,
                this.ownerFullName = t.Delivery.OwnerDisplayName,
                this.ownerBio = t.Delivery.OwnerBio,
                this.ownerIsOverQuota = t.Delivery.OwnerIsOverQuota,
                this.invocationId = t.InvocationId,
                this.embedUrl = t.EmbedUrl,
                this.downloadUrl = t.DownloadUrl,
                this.podcastCompleted = t.PodcastCompleted,
                this.broadcastRefreshInterval = 1e3 * t.BroadcastRefreshInterval,
                this.webcastApiRefreshInterval = 1e3 * t.WebcastPingIntervalInSeconds,
                this.broadcastSegmentBackoff = t.BroadcastSegmentBackoff,
                this.allowPublicNotes = t.AllowPublicNotes,
                this.hasAnyLinks = t.Delivery.HasAnyLinks,
                this.hasQuiz = t.Delivery.HasQuiz,
                this.firstQuizOffset = t.Delivery.FirstQuizOffset,
                this.hasCaptions = t.Delivery.HasCaptions,
                this.availableLanguages = t.Delivery.AvailableLanguages,
                this.isBroadcast = r,
                this.isViewable = r && !!u || t.Delivery.IsViewerEncodeComplete && t.Delivery.IsViewerEncodeAvailable,
                this.isEmbedViewable = this.isViewable || f.length > 0,
                this.isViewerEncodeAvailable = t.Delivery.IsViewerEncodeAvailable,
                this.isReadyForEditing = t.Delivery.IsReadyForEditing,
                this.rehydrationAvailable = t.Delivery.RehydrationAvailable,
                this.isPurgedEncode = t.Delivery.IsPurgedEncode,
                this.isPurgedLegacyEncode = t.Delivery.IsPurgedLegacyEncode,
                this.requiresAdvancedEditor = t.Delivery.RequiresAdvancedEditor,
                this.broadcastEnded = t.Delivery.BroadcastEnded,
                this.broadcastInterrupted = t.Delivery.BroadcastInterrupted,
                this.isRecentBroadcast = s,
                this.isPrimaryAudioOnly = t.Delivery.IsPrimaryAudioOnly,
                this.requiresSilverlight = P,
                this.flowPlayerEnabled = y,
                this.multiBitrateEnabled = m,
                this.playSpeedEnabled = v,
                this.discussionEnabled = t.Delivery.DiscussionEnabled,
                this.discussionCacheSeconds = t.DiscussionCacheSeconds,
                this.lastViewingPosition = t.LastViewingPosition,
                this.completionPercentage = t.CompletionPercentage,
                this.normalizeVolume = t.Delivery.NormalizeVolume,
                this.activePrimary = u,
                this.primaryStreams = d,
                this.secondaryStreams = c,
                this.podcastStreams = f,
                this.slideDecks = S.length ? [n.SlideDeck(S)] : [],
                this.documents = C,
                this.thumbnails = w,
                this.captions = [],
                this.contents = b,
                this.channels = T,
                this.tags = t.Delivery.Tags,
                this.user = {
                    email: t.UserEmail,
                    name: t.UserName,
                    key: (t.UserKey || "").toLowerCase(),
                    rating: t.UserRating,
                    role: t.SessionRole,
                    canCreateQuestionLists: t.UserCanCreateQuestionLists,
                    permissions: t.Delivery.Permissions || []
                },
                this.folder = {
                    name: t.Delivery.SessionGroupLongName,
                    description: t.Delivery.SessionGroupAbstract,
                    id: t.Delivery.SessionGroupPublicID
                },
                this.nextDelivery = void 0,
                t.Delivery.NextDeliveryUrl && (this.nextDelivery = {
                    id: t.Delivery.NextDeliveryId,
                    url: t.Delivery.NextDeliveryUrl,
                    title: t.Delivery.NextDeliveryTitle,
                    description: t.Delivery.NextDeliveryDescription,
                    duration: Panopto.Core.TimeHelpers.formatDuration(t.Delivery.NextDeliveryDuration, Panopto.GlobalResources.TimeSeparator),
                    thumbUrl: t.Delivery.NextDeliveryThumbUrl,
                    isLive: t.Delivery.NextDeliveryIsLive,
                    folderName: void 0
                }),
                this.serverModel = t
            }
            return n.prototype.parseStreams = function(e, n, o) {
                var i = _.map(_.filter(e, (function(e) {
                    return "Archival" === e.StreamTypeName
                }
                )), (function(e) {
                    return Panopto.Viewer.Data.Stream(e, o, n)
                }
                ))
                  , a = (i = _.sortBy(i, "relativeStart")).length ? o ? _.find(i, (function(e) {
                    return !e.relativeEnd
                }
                )) || _.max(i, (function(e) {
                    return e.relativeEnd
                }
                )) : i[0] : void 0
                  , r = o ? i : a ? [a] : []
                  , s = _.map(_.filter(e, (function(e) {
                    return "Archival" !== e.StreamTypeName
                }
                )), (function(e) {
                    return Panopto.Viewer.Data.Stream(e, o, n)
                }
                ));
                return {
                    primaryStreams: r,
                    secondaryStreams: s,
                    activePrimary: a,
                    screenCaptureStream: _.find(s, (function(e) {
                        return e.tabClass === t.Constants.ScreenCaptureClass
                    }
                    ))
                }
            }
            ,
            n.prototype.parsePlayerInfo = function(e, n, o) {
                var i = !!n && _.contains([Panopto.Core.MediaFileType.ism, Panopto.Core.MediaFileType.wmv], n.mediaFileType)
                  , a = !new RegExp(Panopto.features.hlsFlashFallbackRegex).test(navigator.userAgent) && !Panopto.Core.Browser.isWin7IE11 && _.any(flowplayer.engines, (function(e) {
                    return "hlsjs" === e.engineName || "hlsjs-lite" === e.engineName
                }
                ))
                  , r = Panopto.Core.Browser.supportsVideo(t.Constants.MP4MimeType)
                  , s = (!e.length || n.mediaFileType === Panopto.Core.MediaFileType.hls) && a || (!e.length || n.mediaFileType === Panopto.Core.MediaFileType.mp4) && r
                  , l = Panopto.viewer.flowplayerEnabled && !i && s
                  , d = !1;
                return n && (d = n.mediaFileType === Panopto.Core.MediaFileType.ism || n.mediaFileType === Panopto.Core.MediaFileType.hls && (l || Panopto.Core.Browser.flashEnabled())),
                {
                    multiBitrateEnabled: d,
                    playSpeedEnabled: n && l,
                    flowPlayerEnabled: l,
                    requiresSilverlight: i
                }
            }
            ,
            n.prototype.parseEvents = function(t, n, o, i, a) {
                var r = Panopto.Viewer.Data
                  , s = _.filter(t, (function(e) {
                    return (e.Time || 0 === e.Time) && e.Time <= i && e.ObjectIdentifier && e.ObjectSequenceNumber
                }
                ))
                  , l = _.filter(s, (function(e) {
                    return "PowerPoint" === e.EventTargetType
                }
                ))
                  , d = _.filter(s, (function(e) {
                    return e.Url
                }
                ))
                  , c = [];
                _.each(d, (function(t) {
                    return c.push(new e.Viewer.Data.Document(t))
                }
                )),
                _.each(n, (function(t) {
                    return c.push(new e.Viewer.Data.Document(t))
                }
                ));
                var u = _.filter(s, (function(e) {
                    return !e.Url && _.contains(["ObjectVideo", "Primary", "SmartOcrToc"], e.EventTargetType)
                }
                )).concat(l);
                u.sort((function(e, t) {
                    return e.Time - t.Time
                }
                ));
                var p, f = _.map(u, (function(t) {
                    return new e.Viewer.Data.Thumbnail(t,a)
                }
                )), h = _.chain(u.concat(d)).unique().map((function(t) {
                    return new e.Viewer.Data.Event(t)
                }
                )).filter((function(e) {
                    return !!jQuery.trim(e.text)
                }
                )).value();
                return o && (p = _.map(o, (function(e) {
                    return r.Channel(e, e, !0)
                }
                ))),
                {
                    slides: l,
                    documents: c,
                    thumbnails: f,
                    contents: h,
                    channels: p
                }
            }
            ,
            n
        }(),
        n.Delivery = o
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Data = Panopto.Viewer.Data || {},
Panopto.Viewer.Data.Stream = function(e, t, n) {
    var o, i = [], a = [], r = e.Name || ("SCREEN" === e.Tag ? Panopto.GlobalResources.ViewerPlus_ScreenCaptureTitle : Panopto.GlobalResources.ViewerPlus_ObjectVideoTitle), s = "SCREEN" === e.Tag ? PanoptoTS.Viewer.Constants.ScreenCaptureClass : PanoptoTS.Viewer.Constants.ObjectVideoTabClass, l = function(e, n) {
        var o = e - PanoptoTS.Viewer.Constants.SecondaryStreamOffset;
        return t || n && o <= n + PanoptoTS.Viewer.Constants.MinSegmentGap ? e : Math.max(0, o)
    };
    switch (e.RelativeSegments && e.RelativeSegments.length ? _.each(e.RelativeSegments, (function(e, t) {
        var n = new PanoptoTS.Viewer.Data.SecondarySegment(e)
          , o = a[t - 1];
        n.timelineStart = l(n.relativeStart, o ? o.relativeEnd : 0),
        a.push(n),
        i.push(n.timelineStart, n.relativeEnd)
    }
    )) : (i.push(l(e.RelativeStart, void 0)),
    e.RelativeEnd && i.push(e.RelativeEnd)),
    (o = PanoptoTS.Viewer.Data.ContentHelpers.createBaseContent(r, e.PublicID, s, i, e.AbsoluteStart, "", "", !1, !1, !1, t, !1)).url = e.StreamUrl,
    o.mediaFileType = PanoptoViewer.isEditor() ? e.EditMediaFileType : e.ViewerMediaFileType,
    o.relativeStart = e.RelativeStart,
    o.relativeEnd = e.RelativeEnd,
    o.length = e.RelativeEnd ? e.RelativeEnd - e.RelativeStart : 0,
    o.segments = a,
    o.interrupted = e.Interrupted,
    o.deliveryTitle = n,
    o.broadcastSegmentDuration = e.BroadcastSegmentDuration,
    o.broadcastSegmentBackoff = e.BroadcastSegmentBackoff || Panopto.viewer.broadcastSegmentBackoff,
    o.vrType = e.VRType,
    Panopto.viewer.pureHlsJsPlayback && o.vrType !== PanoptoViewer.MediaVRType.None && (Panopto.Core.Browser.isSafari || Panopto.Core.Browser.isIE) && (window.location.href = window.location.href + "&pureHlsJs=false"),
    e.Tag) {
    case "AUDIO":
        o.type = Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Audio,
        o.isAudioOnly = !0;
        break;
    case "SCREEN":
        o.type = Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Screen,
        o.isAudioOnly = !1;
        break;
    default:
        o.type = Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Camera,
        o.isAudioOnly = !1
    }
    return o.optimizationToken = e.OptimizationToken,
    o
}
,
function(e) {
    !function(e) {
        !function(e) {
            var t = function(e) {
                this.relativeStart = e.RelativeStart,
                this.relativeEnd = e.End ? e.RelativeStart + (e.End - e.Start) : 1 / 0,
                this.streamOffset = e.Start
            };
            e.SecondarySegment = t
        }(e.Data || (e.Data = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e() {}
                return e.prototype.getStreamFriendlyType = function() {
                    var e;
                    switch (this.type) {
                    case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Audio:
                        e = Panopto.GlobalResources.ViewerPlus_AudioTitle;
                        break;
                    case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Screen:
                    case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Slide:
                        e = Panopto.GlobalResources.ViewerPlus_ScreenCaptureTitle;
                        break;
                    case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Camera:
                    default:
                        e = Panopto.GlobalResources.ViewerPlus_ObjectVideoTitle
                    }
                    return e
                }
                ,
                e.prototype.getStreamName = function() {
                    return this.name || this.getStreamFriendlyType()
                }
                ,
                e.convertFromApiModel = function(t) {
                    var n = new e;
                    return n.id = t.id,
                    n.url = t.url,
                    n.httpUrl = t.httpUrl,
                    n.absoluteStart = t.absoluteStart,
                    n.duration = t.duration,
                    n.thumbnailUrlBase = t.thumbnailUrlBase,
                    n.thumbnailInterval = t.thumbnailInterval,
                    n.type = t.type,
                    n.vrType = t.vrType,
                    n.name = t.name,
                    n.iconCode = t.iconCode,
                    n.absoluteEnd = t.absoluteEnd(),
                    n.streamType = t.isPrimary ? 1 : 2,
                    n.normalizeVolume = t.normalizeVolume,
                    n.mediaFileType = t.viewerMediaFileType,
                    n
                }
                ,
                e
            }();
            e.Stream = t
        }(e.Data || (e.Data = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = Panopto.Viewer.PlayState
              , n = PanoptoCore.Logging.Logger
              , o = function() {
                function o(e, t, n, o, i) {
                    this.viewer = e,
                    this.playControls = t,
                    this.primaryPlayer = n,
                    this.secondaryContentContainers = o,
                    this.name = i,
                    this.wasPrimaryFullscreen = !1,
                    this.wasBackgrounded = !1,
                    this.previousPrimaryId = ""
                }
                return o.prototype.synchronize = function(e, n, o, i) {
                    this.logSynchronize(o),
                    o && this.clearSyncTimeout();
                    var a, r = !1;
                    return this.prepareForSync(e),
                    i || (a = this.getBlockingPosition(e, n, o, this.secondaryTabs)),
                    _.isNumber(a) && a !== e ? (this.viewer.setPlayState(t.Paused, !1, !1),
                    this.viewer.setPosition(a)) : r = this.doRemediation(e, n, o, i),
                    this.wasPrimaryFullscreen = this.primaryPlayer.isFullscreen(),
                    this.wasBackgrounded = "hidden" === document.visibilityState,
                    r
                }
                ,
                o.prototype.getName = function() {
                    return this.name
                }
                ,
                o.prototype.getDetails = function() {
                    return this.getName()
                }
                ,
                o.prototype.getBlockingPosition = function(t, n, o, i) {
                    var a, r = _.map(i, (function(e) {
                        return e.content()
                    }
                    )), s = e.ContentLogic.getBlockingContent(r, t);
                    if (s)
                        a = s.timeline[0];
                    else if (!o) {
                        var l = e.ContentLogic.getPausingContent(r, n, t);
                        l && (a = l.timeline[0])
                    }
                    return a
                }
                ,
                o.prototype.logSynchronize = function(e) {
                    var t = this.primaryPlayer.activePrimary();
                    t && (e && n.info("User-initiated sync of primary " + t.id),
                    this.previousPrimaryId !== t.id && (this.previousPrimaryId = t.id,
                    n.info("Primary player started playing stream " + t.id)),
                    this.wasPrimaryFullscreen !== this.primaryPlayer.isFullscreen() && n.info("Primary player changed fullscreen to " + this.primaryPlayer.isFullscreen()))
                }
                ,
                o
            }();
            e.BasePlayerSynchronizationLogic = o
        }(e.Logic || (e.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e() {}
                return e.getBlockingContent = function(e, t) {
                    return _.find(e, (function(e) {
                        var n = e.timeline[0];
                        return e.isSessionPlaybackBlocking && n <= t
                    }
                    ))
                }
                ,
                e.getPausingContent = function(e, t, n) {
                    return _.find(e, (function(e) {
                        var o = e.timeline[0];
                        return e.pauseWhenAvailable && o > t && o <= n
                    }
                    ))
                }
                ,
                e
            }();
            e.ContentLogic = t
        }(e.Logic || (e.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = PanoptoCore.Logging.Logger
              , o = function() {
                function t(n) {
                    var o = this;
                    this.config = n,
                    this.FlowplayerMachineFactory = {
                        create: function(n, i) {
                            var a;
                            return Panopto.viewer.isHiveEnabled && !o.config.isEditor ? (t.log("HiveFlowplayerMachine"),
                            a = new e.Viewer.Players.HiveFlowplayerMachine(n,i,o.config.playerHelpers)) : Panopto.viewer.pureHlsJsPlayback || Panopto.viewer.isKollectiveEnabled || Panopto.viewer.flowplayerSSP ? (Panopto.viewer.isKollectiveEnabled && !o.config.isEditor && PanoptoViewer.Players.PrimitivePlayerFactory.enableKollective(),
                            Panopto.viewer.flowplayerSSP && PanoptoViewer.Players.PrimitivePlayerFactory.useFlowplayer(),
                            Panopto.viewer.trustBrowserNativeHls && PanoptoViewer.Players.PrimitivePlayerFactory.trustBrowserNativeHls(),
                            t.log("SingleStreamMediaPlayer"),
                            a = new e.Viewer.Players.SingleStreamMediaPlayer(n,i,o.config.playerHelpers)) : (t.log("FlowplayerMachine"),
                            a = new e.Viewer.Players.FlowplayerMachine(n,i,o.config.playerHelpers)),
                            a
                        }
                    },
                    this.SilverlightFactory = {
                        create: function(e, n) {
                            return t.log("SilverlightPlayer"),
                            Panopto.Viewer.Players.SilverlightPlayer(e, n)
                        }
                    },
                    this.VideoJsFactory = {
                        create: function(e, n) {
                            return t.log("VideoJsPlayer"),
                            PanoptoLegacy.Viewer.Players.VideoJsPlayer(e, n, o.config.playerHelpers)
                        }
                    }
                }
                return t.log = function(e) {
                    n.info("DefaultPlayerSelectionLogic: " + e)
                }
                ,
                t.prototype.getPlayerFactory = function(e) {
                    return e.requiresSilverlight ? this.SilverlightFactory : e.flowPlayerEnabled ? this.FlowplayerMachineFactory : this.VideoJsFactory
                }
                ,
                t
            }();
            t.DefaultPlayerSelectionLogic = o
        }(t.Logic || (t.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = function() {
                function t(e, t, n, o, i, a, r, s, l) {
                    this.delivery = e,
                    this.viewer = t,
                    this.editor = n,
                    this.sessionsService = o,
                    this.clientParams = i,
                    this.deliveryService = a,
                    this.tagService = r,
                    this.subscriptionService = s,
                    this.userService = l
                }
                return t.prototype.createTabs = function(t, n, o) {
                    var i, a, r, s, l = e.Viewer.Tabs.ViewerEventTabHelpers.create(this.viewer, t, n, o), d = [];
                    i = PanoptoLegacy.Viewer.Tabs.Editor.EditDetailsTab($("#editDetailsTabHeader"), $("#editDetailsTabPane"), this.viewer, l, this.editor, this.editor.timeConverter, this.delivery.id, this.delivery.title, this.delivery.description, this.delivery.tags, this.delivery.ownerId, this.delivery.ownerFullName, this.delivery.ownerBio, this.deliveryService, this.tagService, this.subscriptionService, this.userService),
                    d.push(i),
                    d.push(PanoptoLegacy.Viewer.Tabs.Editor.EditContentsTab($("#editContentsTabHeader"), $("#editContentsTabPane"), l, this.editor, this.delivery.user.canCreateQuestionLists, this.editor.eventService, this.editor.timeConverter, this.deliveryService)),
                    d.push(PanoptoLegacy.Viewer.Tabs.Editor.EditTranscriptTab($("#editTranscriptTabHeader"), $("#editTranscriptTabPane"), l, this.editor, this.editor.timeConverter, this.delivery.availableLanguages, this.deliveryService)),
                    window.slidesTab ? (window.slidesTab.setTimelineEditor(this.editor),
                    window.slidesTab.setReadyStreamUploader()) : window.slidesTab = PanoptoLegacy.Viewer.Tabs.Editor.EditSlidesTab($("#editSlidesTabHeader"), $("#editSlidesTabPane"), l, this.editor, this.clientParams, window.slideUploader, this.editor.timeConverter, this.deliveryService),
                    d.push(window.slidesTab),
                    r = PanoptoLegacy.Viewer.Tabs.Editor.EditCutTab($("#editCutTabHeader"), $("#editCutTabPane"), l, this.editor, this.deliveryService),
                    window.streamTab ? (window.streamTab.setTimelineEditor(this.editor),
                    window.streamTab.setReadyStreamUploader()) : (window.streamTab = PanoptoLegacy.Viewer.Tabs.Editor.EditStreamTab($("#editStreamTabHeader"), $("#editStreamTabPane"), l, this.editor, this.clientParams, window.streamUploader, this.sessionsService, this.editor.timeConverter, this.deliveryService),
                    window.streamTab.setTimelineEditor(this.editor)),
                    a = window.streamTab;
                    var c = d.slice();
                    return c.push(r),
                    c.push(a),
                    this.delivery.user.canCreateQuestionLists && (s = PanoptoLegacy.Viewer.Tabs.Editor.EditQuestionListTab($("#editQuestionListTabHeader"), $("#editQuestionListTabPane"), l, this.editor, this.editor.timeConverter, this.editor.eventService, this.deliveryService),
                    c.push(s)),
                    {
                        tabs: c,
                        searchTab: void 0,
                        detailsTab: void 0,
                        commentsTab: void 0,
                        editEventTabs: d,
                        editDetailsTab: i,
                        editStreamTab: a,
                        editCutTab: r,
                        editQuestionListTab: s
                    }
                }
                ,
                t
            }();
            t.EditorEventTabLogic = n
        }(t.Logic || (t.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = function() {
                function t(e, t) {
                    this.lastDuration = 0,
                    this.lastLevelAgeMillis = 0,
                    this.attach(e, t)
                }
                return t.prototype.getDuration = function() {
                    var e = ((this.lastLevelLoadTime ? (new Date).getTime() - this.lastLevelLoadTime : 0) + this.lastLevelAgeMillis) / 1e3;
                    return this.lastDuration + e
                }
                ,
                t.prototype.attach = function(e, t) {
                    var n = this;
                    if (e.engine.hls && e.engine.hls.on("hlsLevelLoaded", (function(e, t) {
                        return n.updateDuration(t)
                    }
                    )),
                    t) {
                        var o = e.engine.hls;
                        o && this.attachXhrSetup(o.config)
                    }
                }
                ,
                t.prototype.attachXhrSetup = function(t) {
                    var n = this
                      , o = t.xhrSetup;
                    t.xhrSetup = function(t, i) {
                        if (_.any(e.Viewer.Constants.HlsLevelFileNames, (function(e) {
                            return i.indexOf(e) >= 0
                        }
                        ))) {
                            var a = n;
                            t.addEventListener("load", (function(e) {
                                a.updateLevelAge(this)
                            }
                            )),
                            o && o(t, i)
                        }
                    }
                }
                ,
                t.prototype.updateLevelAge = function(t) {
                    var n = t.getResponseHeader(e.Viewer.Constants.HttpHeaders.Date)
                      , o = t.getResponseHeader(e.Viewer.Constants.HttpHeaders.LastModified);
                    if (n && o) {
                        var i = Date.parse(n)
                          , a = Date.parse(o);
                        isNaN(i) || isNaN(a) || (this.lastLevelAgeMillis = i - a)
                    }
                }
                ,
                t.prototype.updateDuration = function(e) {
                    this.lastLevelLoadTime = (new Date).getTime(),
                    this.lastDuration = e.details.totalduration
                }
                ,
                t
            }();
            t.HlsJsWebcastDurationEstimator = n
        }(t.Logic || (t.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = function() {
                function t() {}
                return t.getBitrate = function(t) {
                    var n = PanoptoCore.CookieHelpers.getUserCookieField(Panopto.user.userKey, t ? e.Viewer.Constants.BitrateCookie : e.Viewer.Constants.MBRBitrateCookie);
                    return null !== n ? parseInt(n, 10) : t ? Panopto.viewer.defaultSSFBitrate : Panopto.viewer.defaultMBRBitrate
                }
                ,
                t
            }();
            t.InitialStateLogic = n
        }(t.Logic || (t.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = function() {
                function t(e, t, n) {
                    this.delivery = e,
                    this.viewer = t,
                    this.deliveryService = n
                }
                return t.prototype.createTabs = function(t, n, o) {
                    var i = e.Viewer.Tabs.ViewerEventTabHelpers.create(this.viewer, t, n, o)
                      , a = [];
                    return a.push(PanoptoLegacy.Viewer.Tabs.NotesTab($("#notesTabHeader"), $("#notesTabPane"), i, this.delivery.id, null, this.delivery.user, this.delivery.channels, this.delivery.allowPublicNotes, !0, this.delivery.isBroadcast, this.deliveryService)),
                    {
                        tabs: a,
                        searchTab: void 0,
                        detailsTab: void 0,
                        commentsTab: void 0
                    }
                }
                ,
                t
            }();
            t.LiveNotesEventTabLogic = n
        }(t.Logic || (t.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(t) {
            var n = Panopto.Viewer.PlayState
              , o = (Panopto.Core.ViewerLogEntryType,
            function() {
                function t(e, t, n) {
                    this.viewer = e,
                    this.playControls = t,
                    this.primaryPlayer = n
                }
                return t.prototype.synchronizePlayPositions = function(t, n) {
                    if (void 0 === this.synchronizingSecondaryTabControls) {
                        var o = this.getPositionDifferences(t, n)
                          , i = e.Constants.SecondarySyncThreshold * this.playControls.playSpeed();
                        o.range > i && this.beginSynchronization(n, o)
                    }
                }
                ,
                t.prototype.stopSynchronization = function() {
                    var e = !!this.synchronizingInterval;
                    return this.synchronizingInterval && (clearInterval(this.synchronizingInterval),
                    this.synchronizingInterval = void 0,
                    this.synchronizingSecondaryTabControls = void 0),
                    e
                }
                ,
                t.prototype.getPositionDifferences = function(e, t) {
                    var n = 0
                      , o = 0;
                    return {
                        list: _.map(t, (function(t) {
                            var i = t.selectedTab() ? t.selectedTab().setPosition(e, !1, void 0, $.noop) : 0;
                            return i > n && (n = i),
                            i < o && (o = i),
                            i
                        }
                        )),
                        max: n,
                        min: o,
                        range: n - o
                    }
                }
                ,
                t.prototype.beginSynchronization = function(t, n) {
                    var o = this;
                    this.viewer.logDesync(n.range, "MultipleSecondary", "pausing to corect", !0),
                    this.synchronizingSecondaryTabControls = t,
                    this.runSynchronization(t, n),
                    this.synchronizingInterval = setInterval((function() {
                        o.synchronizingSecondaryTabControls ? o.runSynchronization(o.synchronizingSecondaryTabControls, o.getPositionDifferences(o.viewer.position(), o.synchronizingSecondaryTabControls)) : o.stopSynchronization()
                    }
                    ), e.Constants.SecondarySynchronizingUpdateRateMillis)
                }
                ,
                t.prototype.runSynchronization = function(t, o) {
                    var i, a = o.range > PanoptoViewer.Constants.SecondarySyncTargetSeconds ? e.Constants.SecondarySynchronizingUpdateRateMillis / 1e3 : PanoptoViewer.Constants.SecondarySyncTargetSeconds;
                    _.each(t, (function(e, t) {
                        e.selectedTab() && (i = o.max - o.list[t] > a ? n.Paused : n.Playing,
                        e.selectedTab().playState(i))
                    }
                    )),
                    i = o.max > a ? n.Paused : n.Playing,
                    this.primaryPlayer.playState(i),
                    o.range <= PanoptoViewer.Constants.SecondarySyncTargetSeconds && this.stopSynchronization()
                }
                ,
                t
            }());
            t.MultipleSecondaryPositionSynchronization = o
        }(e.Logic || (e.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
__extends = this && this.__extends || function() {
    var e = function(t, n) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        ,
        e(t, n)
    };
    return function(t, n) {
        if ("function" != typeof n && null !== n)
            throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function o() {
            this.constructor = t
        }
        e(t, n),
        t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype,
        new o)
    }
}();
!function(e) {
    !function(t) {
        !function(t) {
            var n = e.Viewer.Constants
              , o = Panopto.Viewer.PlayState
              , i = e.Viewer.ViewMode
              , a = PanoptoCore.Logging.Logger
              , r = function(e) {
                function r(n, o, i, a) {
                    var r = e.call(this, n, o, i, a, "MultipleSecondary") || this;
                    return r.defaultTabMap = {},
                    r.positionSynchronization = new t.MultipleSecondaryPositionSynchronization(n,o,i),
                    r
                }
                return __extends(r, e),
                r.prototype.prepareForSync = function(e) {
                    this.secondaryTabControls = _.map(this.secondaryContentContainers, (function(e) {
                        return e.getTabControl()
                    }
                    )),
                    this.secondaryTabs = this.secondaryTabControls[0].getTabs(),
                    this.availableTabs = _.filter(this.secondaryTabs, (function(t) {
                        return t.available(e)
                    }
                    ))
                }
                ,
                r.prototype.doRemediation = function(e, t, n, o) {
                    return this.checkAllSecondaryTabs(e, n, o, this.availableTabs, this.secondaryTabs, this.secondaryTabControls),
                    !0
                }
                ,
                r.prototype.clearSyncTimeout = function() {
                    this.positionSynchronization.stopSynchronization()
                }
                ,
                r.prototype.synchronizeSecondaryTabs = function(e, t, n) {
                    var i = this;
                    t || this.wasPrimaryFullscreen && !this.primaryPlayer.isFullscreen() || this.wasBackgrounded && "hidden" !== document.visibilityState ? (this.primaryPlayer.setPlayStateWithLogging(this.viewer.playState(), t),
                    _.each(n, (function(t) {
                        t.selectedTab() && t.selectedTab().setPosition(e, !0, void 0, (function() {
                            t.selectedTab() && t.selectedTab().playState(i.viewer.playState())
                        }
                        ))
                    }
                    ))) : this.primaryPlayer.isFullscreen() || "hidden" === document.visibilityState ? this.positionSynchronization.stopSynchronization() && this.primaryPlayer.setPlayStateWithLogging(this.viewer.playState(), t) : this.viewer.playState() === o.Playing && this.positionSynchronization.synchronizePlayPositions(e, n)
                }
                ,
                r.prototype.getSecondaryTabControlPriorities = function(e, t, n) {
                    var o = this;
                    return _.chain(e).map((function(e, i) {
                        var a = o.getSelectedTabPriority(e, t, n);
                        return {
                            selectedPriority: a,
                            selectedPriorityCombined: void 0 !== a ? a : i - n.length,
                            secondaryTabControl: e
                        }
                    }
                    )).sortBy((function(e) {
                        return e.selectedPriorityCombined
                    }
                    )).value()
                }
                ,
                r.prototype.getUnusedAvailableTabs = function(e, t) {
                    var n = _.chain(t).filter((function(e) {
                        return !!e.selectedTab()
                    }
                    )).map((function(e) {
                        return e.selectedTab().id()
                    }
                    )).value();
                    return _.reject(e, (function(e) {
                        return n.indexOf(e.id()) >= 0
                    }
                    ))
                }
                ,
                r.prototype.checkAllSecondaryTabs = function(e, t, n, o, a, r) {
                    var s = this
                      , l = this.getSecondaryTabControlPriorities(r, e, o)
                      , d = this.getUnusedAvailableTabs(o, r)
                      , c = !1
                      , u = d.pop();
                    _.each(l, (function(i) {
                        var a = i.secondaryTabControl
                          , r = void 0 !== i.selectedPriority;
                        if (u) {
                            var l = s.getTabPriority(u, o)
                              , p = a.getIndex()
                              , f = !!r && a.selectedTab().id() === s.defaultTabMap[p];
                            if (!r || f && l > i.selectedPriority) {
                                var h = _.find(a.getTabs(), (function(e) {
                                    return e.id() === u.id()
                                }
                                ));
                                s.setSecondaryTab(a, e, h),
                                s.defaultTabMap[p] = u.id(),
                                u = d.pop(),
                                c = !0
                            } else
                                f || (s.defaultTabMap[p] = void 0)
                        } else
                            r || s.clearSecondaryTab(a, e, t, n) && (c = !0)
                    }
                    ));
                    var p = 0 !== o.length
                      , f = p
                      , h = this.viewer.hasPendingSecondaryUploads();
                    f || (f = this.shouldShowInitialSecondaries(e, n, a) || h);
                    f ? (this.viewer.viewMode(i.Secondary),
                    !p && h && this.viewer.toggleSecondaryPlaceholder(!0),
                    this.synchronizeSecondaryTabs(e, t, r),
                    c && this.viewer.resize()) : (this.viewer.ensureSecondaryIsMinimized(),
                    this.viewer.viewMode(i.Primary))
                }
                ,
                r.prototype.setSecondaryTab = function(e, t, n) {
                    a.info("Secondary_" + e.getIndex() + " player started playing stream " + n.id()),
                    e.selectSecondaryTab(n, !1),
                    n.pauseWhenAvailable() && (this.viewer.setPlayState(o.Paused, !1, !1),
                    this.viewer.setFullscreenPlayer(void 0)),
                    e.updateSecondaryTabEnabledState(!n.hiddenTab(), t),
                    this.viewer.toggleSecondaryPlaceholder(!1)
                }
                ,
                r.prototype.getSelectedTabPriority = function(e, t, n) {
                    var o, i = e.selectedTab();
                    return i && i.available(t) && (o = this.getTabPriority(i, n)),
                    o
                }
                ,
                r.prototype.getTabPriority = function(e, t) {
                    var n = _.findIndex(t, (function(t) {
                        return t.id() === e.id()
                    }
                    ));
                    return n >= 0 ? n : void 0
                }
                ,
                r.prototype.clearSecondaryTab = function(e, t, n, o) {
                    var i = void 0 !== e.selectedTab();
                    return e.selectSecondaryTab(void 0, n),
                    e.updateSecondaryTabEnabledState(!0, t),
                    i && a.info("Secondary_" + e.getIndex() + " player no longer has a stream"),
                    i
                }
                ,
                r.prototype.shouldShowInitialSecondaries = function(e, t, o) {
                    var i = [];
                    _.each(o, (function(e) {
                        i = i.concat(e.timeline())
                    }
                    )),
                    i.sort((function(e, t) {
                        return e - t
                    }
                    ));
                    var a = _.find(i, (function(t) {
                        return t > e
                    }
                    ));
                    return !t && a < n.InitialSecondaryThreshold && i.length && i[0] < n.InitialSecondaryThreshold
                }
                ,
                r
            }(t.BasePlayerSynchronizationLogic);
            t.MultipleSecondarySynchronizationLogic = r
        }(t.Logic || (t.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
var Panopto = Panopto || {};
!function(e) {
    !function(t) {
        !function(t) {
            var n = PanoptoCore.Logging.Logger
              , o = function() {
                function o() {}
                return o.create = function(e, t, i, a) {
                    var r = o.createImpl(e, t, i, a);
                    return n.info("SyncLogicFactory: selecting " + r.getName()),
                    r
                }
                ,
                o.getRequestedVersion = function() {
                    var t, n = null !== (t = Panopto.viewer.playerSyncLogicVersion) && void 0 !== t ? t : "", o = e.StringHelpers.parseQueryString(window.location.search, !1, !0);
                    return Panopto.Core.Browser.isSafari && (n = "allowprimarypause"),
                    o.synclogic && (n = o.synclogic),
                    n.toLowerCase()
                }
                ,
                o.createImpl = function(e, n, i, a) {
                    if (a.length > 1)
                        return new t.MultipleSecondarySynchronizationLogic(e,n,i,a);
                    switch (o.getRequestedVersion()) {
                    case "multiplesecondary":
                        return new t.MultipleSecondarySynchronizationLogic(e,n,i,a);
                    case "noop":
                        return new t.TwoPlayerSynchronizationLogic(e,n,i,a,t.Mode.NoAdjust);
                    case "allowprimarypause":
                        return new t.TwoPlayerSynchronizationLogic(e,n,i,a,t.Mode.AllowPrimaryPause);
                    case "hybrid":
                        var r = e.isActiveBroadcast() ? t.Mode.AllowPrimaryPause : t.Mode.NoPausePrimary;
                        return new t.TwoPlayerSynchronizationLogic(e,n,i,a,r);
                    default:
                        return new t.TwoPlayerSynchronizationLogic(e,n,i,a,t.Mode.NoPausePrimary)
                    }
                }
                ,
                o
            }();
            t.PlayerSynchronizationLogicFactory = o
        }(t.Logic || (t.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t, n = PanoptoCore.Logging.Logger;
            !function(e) {
                e[e.Player = 0] = "Player",
                e[e.NotReady = 1] = "NotReady",
                e[e.Interrupted = 2] = "Interrupted",
                e[e.Ended = 3] = "Ended"
            }(t = e.FindPrimaryState || (e.FindPrimaryState = {}));
            var o = function() {
                function e(e) {
                    var t = this;
                    this.actualRelativeEnds = {},
                    this.maxSeekablePositionClient = 0,
                    this.totalDurationClient = 0,
                    this.handleReady = function(e) {
                        t.playingStream = e.content,
                        t.updateEdgeValuesFromHlsjs(e.maxSeekablePosition + t.playingStream.relativeStart, e.totalDuration + t.playingStream.relativeStart)
                    }
                    ,
                    this.handleDurationUpdate = function(e) {
                        t.updateEdgeValuesFromHlsjs(e.maxSeekablePosition + t.playingStream.relativeStart, e.totalDuration + t.playingStream.relativeStart)
                    }
                    ,
                    this.handleDurationFinalized = function(e) {
                        var n = e.totalDuration + t.playingStream.relativeStart;
                        t.updateEdgeValuesFromHlsjs(n, n),
                        t.updatePrimaryStreamRelativeEndFromHlsjs(t.playingStream, n)
                    }
                    ,
                    this.handleProgress = function(e) {
                        t.playingPosition = e + t.playingStream.relativeStart
                    }
                    ,
                    this.handleFinish = function() {
                        t.updatePrimaryStreamRelativeEndFromHlsjs(t.playingStream, t.playingPosition)
                    }
                    ,
                    e.onReady && e.onReady.add(this.handleReady),
                    e.onDurationUpdate && e.onDurationUpdate.add(this.handleDurationUpdate),
                    e.onDurationFinalized && e.onDurationFinalized.add(this.handleDurationFinalized),
                    e.onProgress && e.onProgress.add(this.handleProgress),
                    e.onFinish && e.onFinish.add(this.handleFinish)
                }
                return e.prototype.updatePrimaryStreamsFromDeliveryInfo = function(e) {
                    this.streams = _.map(e, (function(e) {
                        return _.clone(e)
                    }
                    )),
                    this.patchPrimaryStreamsWithActualRelativeEnd(),
                    this.streamAtLive = this.findPrimary(void 0, 1 / 0).stream,
                    0 !== this.streamAtLive.relativeEnd ? this.serverDeterminedDuration = this.streamAtLive.relativeEnd : this.serverDeterminedDuration = void 0
                }
                ,
                e.prototype.findPrimary = function(e, n) {
                    var o = _.find(this.primaryStreams, (function(e) {
                        return !e.relativeEnd || n < e.relativeEnd
                    }
                    ))
                      , i = t.Player;
                    if (o || (o = _.max(this.primaryStreams, (function(e) {
                        return e.relativeEnd || 0
                    }
                    ))),
                    !o.relativeEnd) {
                        var a = this.totalDuration - o.relativeStart;
                        if (e > 0 && a <= e)
                            return this.findPrimary(void 0, this.totalDuration - e);
                        void 0 === e ? (n = o.relativeStart,
                        i = 0 === o.relativeStart ? t.NotReady : t.Interrupted) : n = Math.clamp(n, o.relativeStart, this.seekableDuration)
                    }
                    return o.relativeEnd > 0 && n >= o.relativeEnd && (n = Math.min(n, o.relativeEnd),
                    i = t.Ended),
                    {
                        stream: o,
                        streamPosition: Math.max(0, n - o.relativeStart),
                        state: i
                    }
                }
                ,
                Object.defineProperty(e.prototype, "primaryStreams", {
                    get: function() {
                        return this.streams
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "seekableDuration", {
                    get: function() {
                        var e = this.maxSeekablePositionClient;
                        return this.serverDeterminedDuration && (e = e ? Math.min(e, this.serverDeterminedDuration) : this.serverDeterminedDuration),
                        e
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "totalDuration", {
                    get: function() {
                        var e = this.totalDurationClient;
                        return this.serverDeterminedDuration && (e = e ? Math.min(e, this.serverDeterminedDuration) : this.serverDeterminedDuration),
                        e
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                e.prototype.updatePrimaryStreamRelativeEndFromHlsjs = function(e, t) {
                    (0 === e.relativeEnd || e.relativeEnd > t) && (this.actualRelativeEnds[e.id] = t),
                    this.patchPrimaryStreamsWithActualRelativeEnd()
                }
                ,
                e.prototype.updateEdgeValuesFromHlsjs = function(e, t) {
                    this.playingStream.id === this.streamAtLive.id && (this.maxSeekablePositionClient > e && n.warning("Updating maxSeekablePositionClient to a lower value: " + this.maxSeekablePositionClient + " -> " + e),
                    this.maxSeekablePositionClient = e,
                    this.totalDurationClient > t && n.warning("Updating maxSeekablePositionClient to a lower value: " + this.totalDurationClient + " -> " + t),
                    this.totalDurationClient = t)
                }
                ,
                e.prototype.patchPrimaryStreamsWithActualRelativeEnd = function() {
                    for (var e = 0, t = this.streams; e < t.length; e++) {
                        var n = t[e]
                          , o = this.actualRelativeEnds[n.id];
                        o && (0 === n.relativeEnd || n.relativeEnd > o) && (n.relativeEnd = o)
                    }
                }
                ,
                e
            }();
            e.PrimaryTimeline = o
        }(e.Logic || (e.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e() {}
                return e.isOnTimeline = function(e, t) {
                    var n = _.filter(e, (function(e) {
                        return e <= t
                    }
                    ));
                    return Boolean(n.length % 2)
                }
                ,
                e
            }();
            e.TimelineLogic = t
        }(e.Logic || (e.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
__extends = this && this.__extends || function() {
    var e = function(t, n) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        ,
        e(t, n)
    };
    return function(t, n) {
        if ("function" != typeof n && null !== n)
            throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function o() {
            this.constructor = t
        }
        e(t, n),
        t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype,
        new o)
    }
}();
!function(e) {
    !function(t) {
        !function(t) {
            var n, o = e.Viewer.Constants, i = Panopto.Viewer.PlayState, a = e.Viewer.ViewMode, r = PanoptoCore.Logging.Logger;
            !function(e) {
                e[e.NoPausePrimary = 0] = "NoPausePrimary",
                e[e.AllowPrimaryPause = 1] = "AllowPrimaryPause",
                e[e.NoAdjust = 2] = "NoAdjust"
            }(n = t.Mode || (t.Mode = {}));
            var s = function(e) {
                function s(t, o, i, a, s) {
                    var l = e.call(this, t, o, i, a, s === n.NoAdjust ? "Noop" : "TwoPlayer") || this;
                    return l.mode = s,
                    1 !== a.length && r.error("(TwoPlayer) Expected a single secondary container. Received " + a.length + "."),
                    s !== n.NoAdjust && r.info("(TwoPlayer) " + (s === n.AllowPrimaryPause ? "Allow secondaries to catch up by pausing primaries (original)" : "Seek secondaries to catch up with primary (new)")),
                    l.secondaryTabControl = a[0].getTabControl(),
                    l
                }
                return __extends(s, e),
                s.prototype.getDetails = function() {
                    return this.getName() + " - " + this.mode
                }
                ,
                s.prototype.prepareForSync = function(e) {
                    this.secondaryTabs = this.secondaryTabControl.getTabs()
                }
                ,
                s.prototype.doRemediation = function(e, t, n, o) {
                    var i = _.chain(this.secondaryTabs).filter((function(t) {
                        return t.available(e)
                    }
                    )).last().value();
                    return i ? (this.setSecondaryTab(e, i, this.secondaryTabs),
                    this.synchronizeSecondaryTab(e, n, this.secondaryTabControl.selectedTab())) : this.clearSecondaryTab(e, n, o, this.secondaryTabs),
                    this.previousDefaultSecondary = i,
                    !0
                }
                ,
                s.prototype.clearSyncTimeout = function() {
                    window.clearTimeout(this.synchronizeTimeout),
                    this.synchronizeTimeout = void 0
                }
                ,
                s.prototype.synchronizeSecondaryTab = function(e, t, a) {
                    var r, s, l, d = this, c = 0;
                    if (this.mode !== n.NoAdjust || t)
                        if (t || this.wasPrimaryFullscreen && !this.primaryPlayer.isFullscreen() || this.wasBackgrounded && "hidden" !== document.visibilityState)
                            this.primaryPlayer.setPlayStateWithLogging(this.viewer.playState(), t),
                            a.setPosition(e, !0, void 0, (function() {
                                return a.playState(d.viewer.playState())
                            }
                            ));
                        else if (this.primaryPlayer.isFullscreen() || "hidden" === document.visibilityState) {
                            var u = !!this.synchronizeTimeout;
                            this.clearSyncTimeout(),
                            u && this.primaryPlayer.setPlayStateWithLogging(this.viewer.playState(), t)
                        } else if (this.viewer.playState() === i.Playing)
                            if ((r = (c = a.setPosition(e, !1, void 0, $.noop)) ? Math.abs(c) : 0) > o.SecondarySyncThreshold * this.playControls.playSpeed()) {
                                var p = c > 0;
                                if (p && this.mode == n.NoPausePrimary)
                                    return void (this.primaryPlayer.isFullscreen() || (a.setPosition(e, !0, void 0, $.noop),
                                    this.logDesync(c, "seeking secondary", !0)));
                                s = p ? this.primaryPlayer : a,
                                l = p ? a : this.primaryPlayer,
                                this.logDesync(c, "pausing " + (p ? "primary" : "secondary"), !0),
                                s.playState(i.Paused),
                                l.playState(i.Playing),
                                this.clearSyncTimeout(),
                                this.synchronizeTimeout = setTimeout((function() {
                                    s.playState(i.Playing),
                                    d.clearSyncTimeout()
                                }
                                ), 1e3 * r / this.playControls.playSpeed())
                            } else
                                this.logDesync(c, "delta within tolerance", !1)
                }
                ,
                s.prototype.logDesync = function(e, t, n) {
                    this.synchronizeTimeout || this.viewer.logDesync(e, this.getName(), t, n)
                }
                ,
                s.prototype.setSecondaryTab = function(e, t, n) {
                    var o = !1
                      , r = this.secondaryTabControl.selectedTab();
                    r && !r.available(e) && (o = !0,
                    r.setSelected(!1, !1)),
                    this.viewer.viewMode(a.Secondary),
                    (o = o || !this.previousDefaultSecondary || _.indexOf(n, t) > _.indexOf(n, this.previousDefaultSecondary)) && (this.secondaryTabControl.selectSecondaryTab(t, !1),
                    this.viewer.resize()),
                    o && t.pauseWhenAvailable() && (this.viewer.setPlayState(i.Paused, !1, !1),
                    this.viewer.setFullscreenPlayer(void 0)),
                    this.secondaryTabControl.updateSecondaryTabEnabledState(!t.hiddenTab(), e),
                    this.viewer.toggleSecondaryPlaceholder(!1)
                }
                ,
                s.prototype.clearSecondaryTab = function(e, t, n, o) {
                    this.secondaryTabControl.selectSecondaryTab(void 0, !1),
                    this.viewer.ensureSecondaryIsMinimized();
                    var i = this.shouldShowInitialSecondaries(e, n, o)
                      , s = this.viewer.hasPendingSecondaryUploads()
                      , l = i || s;
                    this.viewer.viewMode(l ? a.Secondary : a.Primary),
                    s && this.viewer.toggleSecondaryPlaceholder(!0),
                    this.secondaryTabControl.selectSecondaryTab(void 0, t),
                    this.secondaryTabControl.updateSecondaryTabEnabledState(!0, e),
                    this.previousDefaultSecondary && r.info("Secondary player no longer has a stream to play")
                }
                ,
                s.prototype.getBlockingOrPausingPosition = function(e, n, o, i, a) {
                    var r, s = _.map(a, (function(e) {
                        return e.content()
                    }
                    )), l = t.ContentLogic.getBlockingContent(s, e);
                    if (l)
                        r = l.timeline[0];
                    else if (!o) {
                        var d = t.ContentLogic.getPausingContent(s, n, e)
                          , c = i && i.content();
                        d && d !== c && (r = d.timeline[0])
                    }
                    return r
                }
                ,
                s.prototype.shouldShowInitialSecondaries = function(e, t, n) {
                    var i = [];
                    _.each(n, (function(e) {
                        i = i.concat(e.timeline())
                    }
                    )),
                    i.sort((function(e, t) {
                        return e - t
                    }
                    ));
                    var a = _.find(i, (function(t) {
                        return t > e
                    }
                    ));
                    return !t && a < o.InitialSecondaryThreshold && i.length && i[0] < o.InitialSecondaryThreshold
                }
                ,
                s
            }(t.BasePlayerSynchronizationLogic);
            t.TwoPlayerSynchronizationLogic = s
        }(t.Logic || (t.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = function() {
                function t(e, t, n, o, i, a, r) {
                    this.delivery = e,
                    this.viewer = t,
                    this.inviteTokenId = n,
                    this.deliveryService = o,
                    this.tagService = i,
                    this.subscriptionService = a,
                    this.userService = r
                }
                return t.prototype.createTabs = function(t, n, o) {
                    var i, a, r, s, l = e.Viewer.Tabs.ViewerEventTabHelpers.create(this.viewer, t, n, o), d = [];
                    if (this.delivery.isBroadcast || (a = PanoptoLegacy.Viewer.Tabs.SearchTab($("#searchTabHeader"), $("#searchTabPane"), l, this.delivery.id, this.delivery.user, this.inviteTokenId, this.deliveryService),
                    d.push(a)),
                    (this.delivery.description || (null === (i = this.delivery.tags) || void 0 === i ? void 0 : i.length) || this.delivery.ownerFullName) && (r = PanoptoLegacy.Viewer.Tabs.DetailsTab($("#detailsTabHeader"), $("#detailsTabPane"), l, this.delivery.id, this.delivery.title, this.delivery.description, this.delivery.tags, this.delivery.ownerId, this.delivery.ownerFullName, this.delivery.ownerBio, this.deliveryService, this.tagService, this.subscriptionService, this.userService),
                    d.push(r)),
                    this.delivery.contents.length && d.push(PanoptoLegacy.Viewer.Tabs.ContentsTab($("#contentsTabHeader"), $("#contentsTabPane"), l, this.delivery.id, this.delivery.contents, this.deliveryService)),
                    this.delivery.hasCaptions && d.push(PanoptoLegacy.Viewer.Tabs.TranscriptTab($("#transcriptTabHeader"), $("#transcriptTabPane"), l, this.delivery, this.inviteTokenId, this.delivery.availableLanguages, this.deliveryService)),
                    this.delivery.hasAnyLinks && d.push(PanoptoLegacy.Viewer.Tabs.AttachmentTab($("#attachmentTabHeader"), $("#attachmentTabPane"), l, this.delivery.id, this.inviteTokenId, this.deliveryService)),
                    Panopto.features.areSocialFeaturesEnabled && this.delivery.discussionEnabled) {
                        var c = this.delivery.user.role > Panopto.Data.AclRoleType.Viewer;
                        s = PanoptoLegacy.Viewer.Tabs.CommentsTab($("#commentsTabHeader"), $("#commentsTabPane"), l, this.delivery.id, this.viewer.getSessionId(), this.inviteTokenId, this.delivery.user, this.delivery.isBroadcast, this.delivery.broadcastRefreshInterval, c, this.deliveryService)
                    }
                    return s && Panopto.viewer.displayViewerDiscussionAboveNotes && (d.push(s),
                    $("#notesTabHeader").before($("#commentsTabHeader"))),
                    this.delivery.user.key && Panopto.viewer.notesEnabled && d.push(PanoptoLegacy.Viewer.Tabs.NotesTab($("#notesTabHeader"), $("#notesTabPane"), l, this.delivery.id, this.inviteTokenId, this.delivery.user, this.delivery.channels, this.delivery.allowPublicNotes, !1, this.delivery.isBroadcast, this.deliveryService)),
                    this.delivery.user.key && d.push(PanoptoLegacy.Viewer.Tabs.BookmarksTab($("#bookmarksTabHeader"), $("#bookmarksTabPane"), l, this.delivery.id, this.delivery.user, this.delivery.isBroadcast, this.deliveryService)),
                    s && !Panopto.viewer.displayViewerDiscussionAboveNotes && d.push(s),
                    {
                        tabs: d,
                        searchTab: a,
                        detailsTab: r,
                        commentsTab: s
                    }
                }
                ,
                t
            }();
            t.ViewerEventTabLogic = n
        }(t.Logic || (t.Logic = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(t) {
            var n = PanoptoCore.VoidCallback
              , o = function() {
                function t() {
                    var e = this;
                    this._onClick = new n,
                    this._onShowOverlay = new n,
                    this.element = $(t.template),
                    this.playerLayoutControlsElement = this.element.find(".player-layout-controls"),
                    this.showOverlayElement = this.element.find(".show-overlay-button"),
                    this.playerLayoutControlsElement.hide(),
                    Panopto.Core.UI.Handlers.button(this.element, (function() {
                        e._onClick.fire()
                    }
                    )),
                    Panopto.Core.UI.Handlers.hoverable(this.element, (function() {
                        e.playerLayoutControlsElement.show(),
                        e.setAutoHideTimeout()
                    }
                    )),
                    Panopto.Core.UI.Handlers.button(this.showOverlayElement, (function() {
                        e._onShowOverlay.fire()
                    }
                    ))
                }
                return Object.defineProperty(t.prototype, "onClick", {
                    get: function() {
                        return this._onClick
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "onShowOverlay", {
                    get: function() {
                        return this._onShowOverlay
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                t.prototype.getElement = function() {
                    return this.element
                }
                ,
                t.prototype.toggle = function(e) {
                    var t = e.showOrHide
                      , n = e.allowShowOverlayButton;
                    this.element.toggle(t),
                    this.showOverlayElement.toggle(n)
                }
                ,
                t.prototype.setAutoHideTimeout = function() {
                    var t = this;
                    clearTimeout(this.autoHideTimeout),
                    this.autoHideTimeout = window.setTimeout((function() {
                        t.playerLayoutControlsElement.is(":hover") || t.playerLayoutControlsElement.hide()
                    }
                    ), 1e3 * e.Constants.FullScreenControlInterval)
                }
                ,
                t.template = '\n        <div class="audio-only-primary-player-overlay">\n            <div class="player-layout-controls">\n                <div class="show-overlay-button"><i class="material-icons">&#xE145;</i></div>\n            </div>\n            <i class="audio-only-icon material-icons">volume_up</i>\n        </div>',
                t
            }();
            t.AudioOnlyOverlay = o
        }(e.Players || (e.Players = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
PanoptoLegacy.Viewer.Players.DocumentPlayer = function(e, t, n) {
    var o, i, a, r = function() {
        i.show(),
        t.isPdf && i.addClass("plugin-screen")
    };
    return e.append(_.template($("#documentPlayerTemplate").html())(t)),
    o = e.find("#" + t.id),
    i = o.find(".document-frame"),
    t.isPdf ? window.PluginDetect.onDetectionDone(PanoptoTS.Viewer.Constants.PluginDetectPDFReader, (function(e) {
        e.isMinVersion(PanoptoTS.Viewer.Constants.PluginDetectPDFReader, 0) < 0 ? o.find(".adobe-reader-install").show() : (r(),
        i.attr("src", t.url))
    }
    ), PanoptoTS.Viewer.Constants.DummyPDFUrl, !0) : r(),
    (a = Panopto.Viewer.Players.PlayerBase(e, o)).resize = function(t, n) {
        e.width(t),
        e.height(n),
        o.width(t - 2),
        o.height(n - 1)
    }
    ,
    a.remove = function() {
        o.remove()
    }
    ,
    a.toggle = function(e) {
        var a = e ? t.url : "";
        o.toggle(e),
        i.attr("src") !== a && (i.attr("src", a),
        e && -1 !== t.url.indexOf(PanoptoViewer.Constants.YouTubeEmbedBaseUrl) && PanoptoViewer.ensureYouTubeIframeApiIsReady((function() {
            new YT.Player(t.id + "frame",{
                events: {
                    onStateChange: function(e) {
                        0 === e.data && n.togglePlaying()
                    }
                }
            })
        }
        )))
    }
    ,
    a
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
Panopto.Viewer.Players.PlayerBase = function(e, t) {
    var n = PanoptoTS.Viewer.Constants;
    return {
        container: function() {
            return e
        },
        width: function() {
            return t.width()
        },
        height: function() {
            return t.height()
        },
        toggle: function(e) {
            t.toggle(e)
        },
        resize: function(o, i, a, r) {
            o = o - parseInt(e.css("border-left-width"), 10) || o,
            i = i - parseInt(e.css("border-bottom-width"), 10) || i,
            a = void 0 !== a ? a : t.width() / t.height();
            var s = o / i
              , l = o
              , d = i;
            t.add(e).css({
                left: "",
                position: ""
            }),
            isNaN(a) ? (l = o = Math.max(o, n.AudioOnlyMinimumWidth),
            r && (0 === i ? e.css({
                left: -l + "px",
                position: "absolute"
            }) : t.css({
                left: -l / 2 + "px"
            })),
            d = i = Math.max(i, n.AudioOnlyMinimumWidth)) : s <= a ? (l = Math.max(o, n.AudioOnlyMinimumWidth),
            d = Math.max(o / a, n.AudioOnlyMinimumWidth)) : (d = Math.max(i, n.AudioOnlyMinimumWidth),
            l = Math.max(i * a, n.AudioOnlyMinimumWidth)),
            t.width(l),
            t.height(d),
            t.css({
                "margin-top": -d / 2 + "px",
                "margin-left": -l / 2 + "px"
            }),
            e.width(o),
            e.height(i)
        },
        content: function(e) {},
        setContent: function(e) {},
        playState: function(e) {},
        position: function(e) {},
        setPosition: function(e) {},
        setStartPosition: function(e) {},
        bitrate: function(e) {},
        playSpeed: function(e) {},
        numericBitrate: function() {
            return 0
        },
        hasMBR: function() {
            return !1
        },
        bitrateLevelOffset: function() {
            return 0
        },
        remove: function() {}
    }
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
PanoptoLegacy.Viewer.Players.PrimaryPlayer = function(e, t, n, o, i, a, r) {
    var s, l, d, c, u, p, f, h, m, v, y = PanoptoCore.Logging.Logger, P = PanoptoLegacy.Viewer.Players.StreamPlayer(e, t, n, !0, o), g = P, S = Panopto.Core.Extensions.base(P), C = 0, w = !0, b = {}, T = 0, E = function(e, t, n) {
        var s = Panopto.Core.StringHelpers.parseQueryString(e.url.slice(e.url.indexOf("?") + 1));
        if (l = e,
        !m) {
            if (Panopto.features.quotasEnabled) {
                var d = Panopto.Core.StringHelpers.parseQueryString(window.location.search.slice(1)).tid
                  , c = i.user.email || "null";
                (v = new PanoptoTS.Controls.QuotaPlaybackTracker(PanoptoCore.CookieHelpers,$("body"),Panopto.GlobalResources,i.id,i.ownerId,Panopto.user.userId,d ? Panopto.Core.StringHelpers.format(Panopto.freeTrialSignUpUrl + Panopto.Core.Constants.SignUpUrlParams, d, c) : Panopto.freeTrialSignUpUrl)).onToggle.add((function(e) {
                    o.setPlayState(e ? Panopto.Viewer.PlayState.Paused : Panopto.Viewer.PlayState.Playing, void 0, void 0)
                }
                ))
            }
            if (Panopto.useFreeTrialTerminology && !Panopto.user.userId && i.secondaryStreams && i.secondaryStreams.length > 0) {
                d = Panopto.Core.StringHelpers.parseQueryString(window.location.search.slice(1)).tid,
                c = i.user.email || "null";
                Panopto.SignupBanner($("#proLoginBanner"), {
                    imageLocation: Panopto.cacheRoot + "/Styles/Less/Application/Images/Header",
                    signupUrl: Panopto.freeTrialSignUpUrl,
                    isEmbed: !1,
                    tokenId: d,
                    userEmail: c,
                    resources: Panopto.GlobalResources
                })
            }
            (m = Panopto.Core.Analytics.PlaybackLogger(P, s.InvocationID, Panopto.Core.ServiceInterface.AnalyticsIngest.addStreamRequests, {
                onSpanUpdated: function(e) {
                    v && v.update(e)
                },
                onSpanUpdateBlocked: r
            })).start()
        }
        e.isAudioOnly ? a.toggle({
            showOrHide: !0,
            allowShowOverlayButton: !1
        }) : a.toggle({
            showOrHide: !1,
            allowShowOverlayButton: !1
        }),
        S.content(l, t, (function() {
            l.isBroadcast && p && p(),
            n && n(),
            v && v.initialize(i.ownerIsOverQuota)
        }
        ))
    }, V = function(e) {
        var t = _.find(s, (function(t) {
            return (e < t.relativeEnd || !t.relativeEnd) && !t.interrupted
        }
        ));
        return t || (t = _.max(s, (function(e) {
            return e.relativeEnd
        }
        ))),
        t
    };
    return g.setPrimaryContent = function(e, t, n, o) {
        T > 0 && _.chain(e).filter((function(e) {
            return 0 === e.relativeEnd
        }
        )).forEach((function(e) {
            e.id in b && (0 !== e.relativeEnd ? (delete b[e.id],
            T--) : (e.relativeEnd = b[e.id],
            y.info("Primary player with stream id " + e.id + " had its relative end patched to " + e.relativeEnd)))
        }
        )),
        s = e,
        l && (l = _.find(e, (function(e) {
            return e.id === l.id
        }
        ))),
        T > 0 && (t = V(P.position())),
        !l && t.isBroadcast && S.position(1 / 0),
        l && !n || E(l || t, n, o)
    }
    ,
    g.content = g.setPrimaryContent,
    g.setPosition = function(e, t) {
        var n, o, i, a = function() {
            p && p()
        };
        if (void 0 === e)
            return n = S.position(),
            o = l.relativeEnd,
            i = V(o),
            o && l.relativeStart + n >= o && i.id !== l.id && (E(i, !1, null),
            S.position(o - i.relativeStart),
            g.setPlayStateWithLogging(Panopto.Viewer.PlayState.Playing, !0)),
            n + l.relativeStart;
        (i = V(e)).id !== l.id && E(i, !1, null),
        l.isBroadcast && !w && e && e !== u && e !== 1 / 0 && e >= C - PanoptoTS.Viewer.Constants.LivePositionTolerance ? g.setIsLive(!0, t) : (e -= l.relativeStart,
        S.position(e, (function() {
            a(),
            t && t()
        }
        )),
        a())
    }
    ,
    g.position = g.setPosition,
    g.setIsLive = function(e, t) {
        if (void 0 === e)
            return w || P.position() >= C - PanoptoTS.Viewer.Constants.LivePositionTolerance;
        e && !w ? (c && window.clearInterval(c),
        P.setPosition(u || 1 / 0, t),
        P.playState(Panopto.Viewer.PlayState.Playing),
        w = !0) : !e && w && (C = u || P.position(),
        c = window.setInterval((function() {
            u && C >= u ? window.clearInterval(c) : C += PanoptoTS.Viewer.Constants.TimedSyncRate / 1e3
        }
        ), PanoptoTS.Viewer.Constants.TimedSyncRate),
        w = !1)
    }
    ,
    g.isLive = g.setIsLive,
    g.updateMaxPosition = function(e) {
        e || w || (w = !0,
        g.setIsLive(!1)),
        (u = e) && C > u && (C = u)
    }
    ,
    P.streamLength = function() {
        return l.isBroadcast ? w ? P.position() : C : S.streamLength()
    }
    ,
    P.ended = function() {
        var e = V(l.relativeEnd)
          , t = S.ended()
          , n = null;
        return t && l.isBroadcast && 0 === l.relativeEnd && (b[l.id] = S.streamLength() + l.relativeStart,
        T++,
        l.relativeEnd = b[l.id],
        n = b[l.id],
        e = V(l.relativeEnd),
        y.info("Ended: Primary player with stream id " + l.id + " had its relative end patched to " + b[l.id])),
        t && e.id !== l.id ? (t = !1,
        P.setPosition(n || l.relativeEnd),
        P.playState(Panopto.Viewer.PlayState.Playing)) : u && P.position() >= u && (t = !0),
        t && l.isBroadcast && (w = !0),
        t && h && h(void 0, Panopto.Viewer.PlayState.Stopped),
        t && v && v.fadeInModalForAnonymous(),
        t
    }
    ,
    g.isEndedBy = P.ended,
    g.activePrimary = function() {
        return l
    }
    ,
    g.onSeek = function(e) {
        p = e
    }
    ,
    g.offSeek = function() {
        p = void 0
    }
    ,
    g.onSpeedChange = function(e) {
        f = e
    }
    ,
    g.offSpeedChange = function() {
        f = void 0
    }
    ,
    g.onPlayStateChangeLog = function(e) {
        h = e
    }
    ,
    g.offPlayStateChangeLog = function() {
        h = void 0
    }
    ,
    P.playSpeed = function(e) {
        var t = S.playSpeed();
        if (void 0 === e)
            return t;
        S.playSpeed(e),
        e !== t && f && f()
    }
    ,
    g.playState = function(e, t) {
        S.playState(e),
        t && e !== d && h && h(d, e),
        d = e
    }
    ,
    g.setPlayStateWithLogging = P.playState,
    g.streamId = function() {
        return l.id
    }
    ,
    g
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
PanoptoLegacy.Viewer.Players.PrimarySegmentPlayer = function(e, t, n, o, i, a) {
    var r, s, l, d, c, u, p, f = PanoptoCore.Logging.Logger, h = PanoptoLegacy.Viewer.Players.StreamPlayer(e, t, n, !0, o), m = h, v = Panopto.Core.Extensions.base(h), y = !1, P = $("#primaryTabHeaders"), g = [], S = function(e) {
        var t;
        return p && (t = _.find(e.element.streams(), (function(e) {
            return e.stream.id === p
        }
        ))),
        t = t || _.find(e.element.streams(), (function(e) {
            return e.stream.isPrimary
        }
        ))
    }, C = function(e, t) {
        var n = _.find(r, (function(t) {
            return t.start <= e && t.end > e
        }
        ));
        if (t && n && n.start < d.start && (n = d),
        n && n !== d) {
            var o = S(n);
            if (o) {
                var i = o.stream.url !== c.stream.url || o.stream.vrType !== c.stream.vrType || o.offset !== c.offset;
                c = o,
                d = n,
                _.each(g, (function(t) {
                    t.available(e)
                }
                )),
                i && (w(_.find(g, (function(e) {
                    return e.id() === c.stream.id
                }
                ))),
                m.setPrimaryContent(void 0, c.stream, void 0, void 0),
                f.verbose("[PrimarySegmentPlayer] Choosing segment " + c.stream.id + ", seeking to " + e),
                h.setPosition(e),
                v.playState(u))
            } else
                (n = _.find(s, (function(t) {
                    return t.start > e
                }
                ))) ? h.setPosition(n.start) : y = !0
        }
    }, w = function(e) {
        e && (_.each(g, (function(t) {
            t !== e && t.selected(!1)
        }
        )),
        e.selected(!0),
        p = e.id())
    };
    return m.setPrimaryContent = function(e, t, n, o) {
        t.isAudioOnly ? a.toggle({
            showOrHide: !0,
            allowShowOverlayButton: !0
        }) : a.toggle({
            showOrHide: !1,
            allowShowOverlayButton: !0
        }),
        v.content(t)
    }
    ,
    m.content = m.setPrimaryContent,
    m.setSegments = function(e, t, n, a) {
        var f = []
          , y = r ? h.position() : 0
          , b = "primary";
        r = e,
        s = t,
        l = n,
        d ? C(y, void 0) : (d = s[0],
        c = S(d),
        m.setPrimaryContent(void 0, c.stream, void 0, void 0)),
        a && (f = _.chain(s).map((function(e) {
            return e.element.streams()
        }
        )).flatten().map((function(e) {
            return e.stream
        }
        )).filter((function(e) {
            return e.isPrimary
        }
        )).map((function(e) {
            return e.id
        }
        )).uniq().value()),
        P.empty(),
        g.length = 0,
        f.length < 2 ? p = void 0 : (_.each(f, (function(e) {
            if (i.getStream(e)) {
                var t, n = [], o = !1;
                _.each(s, (function(i) {
                    (t = i.element.getStreamById(e)) ? o || (n.push(i.start),
                    o = !0) : o && (n.push(i.start),
                    o = !1)
                }
                )),
                P.append(_.template($("#playerTabHeaderTemplate").html())({
                    content: {
                        id: e,
                        title: i.getStreamName(void 0, e),
                        tabClass: i.getStreamIconClass(void 0, e)
                    },
                    type: b,
                    tabindex: 0
                })),
                g.push(Panopto.Viewer.Tabs.PlayerTabHeader(P.find("#primary" + e), e, n, !0, t && t.stream ? PanoptoTS.Viewer.Controls.MaterialDesignIconHelpers.getStreamIconCode(t.stream) : Panopto.Core.Constants.ObjectVideoIconCode))
            }
        }
        )),
        Panopto.Core.UI.Handlers.button(P.find("." + PanoptoTS.Viewer.Constants.PrimaryTabHeaderClass), (function(e) {
            var t = _.find(g, (function(t) {
                return t.owns(e)
            }
            ))
              , n = h.position();
            t && ("number" == typeof t.seekTime() && (n = t.seekTime(),
            o.setPosition(n)),
            w(t),
            c = S(d),
            m.setPrimaryContent(void 0, c.stream, void 0, void 0),
            h.setPosition(n),
            v.playState(u))
        }
        )),
        _.each(g, (function(e) {
            e.available(y)
        }
        )),
        w(p ? _.find(g, (function(e) {
            return e.id() === p
        }
        )) : _.find(g, (function(e) {
            return e.id() === c.stream.id
        }
        ))))
    }
    ,
    m.activePrimary = function() {
        return c ? c.stream : void 0
    }
    ,
    h.playState = function(e) {
        u = e,
        v.playState(e)
    }
    ,
    m.setPlayStateWithLogging = h.playState,
    h.position = function(e) {
        if (d) {
            if (void 0 !== e) {
                y = !1,
                C(e, void 0);
                var t = e - d.start + c.offset / Panopto.Core.Constants.TimelineChunkMultiplier;
                v.position(t)
            } else
                e = v.position() + d.start - c.offset / Panopto.Core.Constants.TimelineChunkMultiplier,
                C(e, !0);
            var n = _.filter(g, (function(t) {
                return t.available(e)
            }
            ));
            return P.toggle(n.length > 1),
            e
        }
        return v.position(e)
    }
    ,
    h.setPosition = h.position,
    h.streamLength = function() {
        return s ? l : v.streamLength()
    }
    ,
    h.ended = function(e) {
        var t = v.ended();
        return t && d !== _.last(s) ? (t = !1,
        h.setPosition(d.end)) : e === l && (y = !0),
        y || v.ended()
    }
    ,
    m.isEndedBy = h.ended,
    m
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Data = Panopto.Viewer.Data || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
PanoptoLegacy.Viewer.Players.SecondaryStreamPlayer = function(e, t, n) {
    var o, i, a, r, s, l, d = PanoptoTS.Viewer.Constants, c = !1;
    e.append(_.template($("#streamPlayerTemplate").html())),
    a = e.find("#secondaryScreen"),
    o = PanoptoLegacy.Viewer.Players.StreamPlayer(e, a, t, !1, n),
    i = Panopto.Core.Extensions.base(o);
    var u = function(e, t) {
        return e - t.relativeStart + t.streamOffset
    }
      , p = function(e) {
        var t, n;
        return r.segments && r.segments.length ? (t = (t = _.find(r.segments, (function(t) {
            return e >= t.timelineStart && e < t.relativeEnd
        }
        ))) || (e < r.segments[0].timelineStart ? r.segments[0] : r.segments[r.segments.length - 1]),
        n = u(e, t)) : n = e - r.relativeStart,
        {
            segment: t,
            offset: n
        }
    };
    return o.content = function(e, t, n) {
        if (void 0 === e)
            return r;
        r = e;
        var o = void 0 !== l;
        if (o) {
            var a = p(l);
            i.setStartPosition(a.offset + d.SecondaryStreamOffset)
        }
        i.setContent(e, t, n),
        o && (i.setStartPosition(void 0),
        l = void 0)
    }
    ,
    o.setContent = o.content,
    o.position = function(e, t, n, a) {
        var l = t
          , c = p(e);
        if (c.segment) {
            if (!t && c.segment !== s) {
                var f = u(e, s);
                n = l = c.offset - f > d.ContiguousSegmentThreshold
            }
            s = c.segment
        }
        if (!l)
            return o.ended(c.offset) ? 0 : c.offset - i.position();
        var h = c.offset + (n ? d.SecondaryStreamOffset : 0)
          , m = i.position();
        n || m !== c.offset + d.SecondaryStreamOffset || (h = m),
        i.setPosition(r.length ? Math.clamp(h, 0, r.length) : Math.max(0, h), a)
    }
    ,
    o.setSecondaryPosition = o.position,
    o.setStartPosition = function(e) {
        l = e
    }
    ,
    o.toggle = function(e) {
        c = e,
        a.toggleClass("hidden-screen", !e)
    }
    ,
    o.minimizeIfHidden = function() {
        c || i.setIsFullscreen(!1)
    }
    ,
    o.ended = function(e) {
        var t = i.streamLength();
        return i.ended() || !(!t || r.isBroadcast) && e >= t - d.EndPositionThreshold
    }
    ,
    o
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
PanoptoLegacy.Viewer.Players.SlidePlayer = function(e, t, n) {
    var o, i, a, r, s, l = PanoptoTS.Viewer.Constants, d = 1;
    return e.append(_.template($("#slidePlayerTemplate").html())({
        id: t.id
    })),
    o = e.find("#" + t.id + "-image"),
    i = e.find("#" + t.id + "-buffer"),
    r = Panopto.Viewer.Players.PlayerBase(e, o),
    s = Panopto.Core.Extensions.base(r),
    r.resize = function(e, t) {
        s.resize(e, t, d)
    }
    ,
    r.position = function(e, r) {
        !function(e) {
            var r, s = _.last(_.filter(t.slides, (function(t) {
                return t.time <= e
            }
            )));
            (s = s || t.slides[0]) && s !== a && (r = s.url || l.SlideImageUrl + "?" + Panopto.Core.StringHelpers.serializeObjectToQueryString(s.queryParams),
            Panopto.Core.ImageHelpers.bufferAndReplaceImageUrl(o, i, r, (function(e) {
                d = e.width / e.height || 0
            }
            )),
            o.unbind("load").on("load", (function() {
                n.resize()
            }
            )),
            a = s)
        }(e),
        r && r()
    }
    ,
    r.setPosition = r.position,
    r.remove = function() {
        o.remove(),
        i.remove()
    }
    ,
    r
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
Panopto.Viewer.PlayState = Panopto.Viewer.PlayState || {},
PanoptoLegacy.Viewer.Players.StreamPlayer = function(e, t, n, o, i) {
    var a, r, s, l, d = PanoptoCore.Logging.Logger, c = PanoptoTS.Viewer.Constants, u = Panopto.Viewer.PlayState, p = Panopto.Viewer.Players.PlayerBase(e, t), f = Panopto.Core.Extensions.base(p), h = n.create(o, t), m = PanoptoTS.Viewer.Constants.InitialVolume, v = !1, y = o ? "Primary" : "Secondary", P = 0, g = PanoptoViewer.PlaySpeed.Normal;
    return l = h.onReady ? h.onReady : $.Deferred().resolve(),
    p.resize = function(n, o) {
        var i;
        try {
            i = h.width() / h.height()
        } catch (e) {}
        var a = Panopto.Core.Browser.isIE11 || Panopto.Core.Browser.isSafari || h.canMoveAudioPlayerOffscreen && h.canMoveAudioPlayerOffscreen();
        f.resize(n, o, i, a),
        h.showShadow(e.height() === t.height())
    }
    ,
    p.content = function(e, t, n) {
        h.content(e, t, n)
    }
    ,
    p.setContent = p.content,
    p.playState = function(e) {
        h.playState(e),
        s !== e && (P = h.position(),
        d.info(y + " player changed play state to " + e)),
        s = e
    }
    ,
    p.position = function(e, t) {
        if (void 0 === e)
            return e = Math.max(h.position() || 0, 0),
            a && e === a && e !== P && s === u.Playing ? e += Math.min(g * ((new Date).getTime() - r), c.MaxPositionInterpolation) / 1e3 : (a = e,
            r = (new Date).getTime()),
            e;
        h.position(e, t),
        P = e,
        d.info(y + " player set position to " + e)
    }
    ,
    p.setPosition = p.position,
    p.setStartPosition = function(e) {
        h.setStartPosition && h.setStartPosition(e)
    }
    ,
    p.bitrate = function(e) {
        h.bitrate(e)
    }
    ,
    p.numericBitrate = function() {
        return h.numericBitrate()
    }
    ,
    p.hasMBR = function() {
        return h.bitrateOptions().length > 1
    }
    ,
    p.bitrateLevelOffset = function() {
        var e = h.bitrateOptions();
        return e.indexOf(h.numericBitrate()) + 1 - e.length
    }
    ,
    p.playSpeed = function(e) {
        if (void 0 === e)
            return g;
        h.playSpeed(e),
        g !== e && d.info(y + " player changed playback speed to " + e),
        g = e
    }
    ,
    p.getCaptionControl = function() {
        return h
    }
    ,
    p.getFullscreenStateControl = function() {
        return h
    }
    ,
    p.volume = function(e) {
        if (void 0 === e)
            return v ? 0 : m;
        0 !== e ? (h.volume(e),
        m = e,
        p.muted(!1)) : p.muted(!0)
    }
    ,
    p.setVolume = p.volume,
    p.muted = function(e) {
        if (void 0 === e)
            return v;
        h.muted(e),
        v = e
    }
    ,
    p.isMuted = p.muted,
    p.width = function() {
        try {
            return h.width()
        } catch (e) {
            return t.width()
        }
    }
    ,
    p.height = function() {
        try {
            return h.height()
        } catch (e) {
            return t.height()
        }
    }
    ,
    p.streamLength = function() {
        return h.streamLength()
    }
    ,
    p.ended = function() {
        return h.ended()
    }
    ,
    p.isFullscreen = function(e) {
        return h.isFullscreen(e)
    }
    ,
    p.setIsFullscreen = p.isFullscreen,
    p.optimizationProvider = function() {
        return h.optimizationProvider ? h.optimizationProvider() : void 0
    }
    ,
    p.onReady = l,
    p
}
,
(Panopto = Panopto || {}).UI = Panopto.UI || {},
Panopto.UI.Components = Panopto.UI.Components || {},
Panopto.Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
Panopto.Viewer.Players.ThumbnailPlayer = function(e, t, n) {
    var o = Panopto.Viewer.Analytics
      , i = Panopto.Viewer.Players.PlayerBase(a)
      , a = $("#thumbnailList")
      , r = $("#toggleThumbnailsButton")
      , s = $("#toggleThumbnailsButtonIcon")
      , l = Panopto.Viewer.Controls.ThumbnailStrip(a, e, t, n)
      , d = !1;
    return Panopto.Core.UI.Handlers.button(r, (function() {
        var e;
        (e = void 0 === (e = void 0) ? !a.is(":visible") : e) ? (s.text("keyboard_arrow_down"),
        a.slideDown({
            step: function() {
                t.resize && t.resize()
            },
            complete: function() {
                d = !1,
                i.position(t.position(), !0)
            }
        }),
        r.attr(Panopto.Core.Constants.AriaExpandedAttribute, (!0).toString()),
        o.sendEvent({
            action: o.Actions.ShowThumbnails,
            label: o.Labels.Normal
        })) : (d = !0,
        s.text("keyboard_arrow_up"),
        r.attr(Panopto.Core.Constants.AriaExpandedAttribute, (!1).toString()),
        a.slideUp({
            step: function() {
                t.resize && t.resize()
            }
        }),
        o.sendEvent({
            action: o.Actions.HideThumbnails,
            label: o.Labels.Normal
        }))
    }
    )),
    r.add(a).toggle(e.length > 0 && !n),
    l.render(),
    i.toggle = function(e) {
        l.toggle(e)
    }
    ,
    i.resize = function(e, t) {}
    ,
    i.position = function(e, t) {
        d || l.position(e, t)
    }
    ,
    i.setPosition = i.position,
    i.thumbnails = function(e) {
        if (!e)
            return l.thumbnails();
        l.thumbnails(n ? _.filter(e, (function(e) {
            return !(e.isDefaultThumbnail || e.link || e.type !== Panopto.Core.EventType.Label && e.type !== Panopto.Core.EventType.SmartOcrToc && e.type !== Panopto.Core.EventType.SlideChange)
        }
        )) : e)
    }
    ,
    i
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Hive = function(e) {
    var t = PanoptoCore.Logging.Logger
      , n = function(e) {
        return Panopto.viewer.isHiveEnabled && e && !Panopto.viewer.isKollectiveEnabled && !Panopto.Core.Browser.isWin7IE11 && "undefined" != typeof hive
    }
      , o = function(e, n) {
        return {
            onError: function(o) {
                var i, a = n.hiveTechOrder.indexOf(e);
                return -1 !== a && (i = a < n.hiveTechOrder.length ? PanoptoTS.StringHelpers.format("{0} failed with message: {1}. Falling through to next tech {2} ", e, o.message, n.hiveTechOrder[a + 1]) : PanoptoTS.StringHelpers.format("{0} failed with message: {1}. End of tech stack falling back to source", e, o.message),
                t.warning(i)),
                !0
            },
            onActiveSession: function(n) {
                t.info(PanoptoTS.StringHelpers.format("Session activated with tech {0}, sessionDetails:", e) + n)
            }
        }
    };
    return e.isHiveOptimized = n,
    e.createFlowplayerPlugin = function(e, t) {
        var i = {};
        if (n(e.optimizationToken)) {
            var a = {};
            a.hiveTechOrder = Panopto.viewer.hiveFlowplayerPluginTechOrder.split(",").map((function(e) {
                return e.trim()
            }
            ));
            var r = a.hiveTechOrder.indexOf("HiveJava");
            t || -1 === r || a.hiveTechOrder.splice(r, 1),
            a.HiveJava = o("HiveJava", a),
            a.HiveJS = o("HiveJS", a),
            a.StatsJS = o("StatsJS", a),
            i = {
                sources: [{
                    type: "application/x-mpegurl",
                    ticket: e.optimizationToken
                }],
                options: a
            }
        }
        return i
    }
    ,
    e.attachFlowplayerHlsJsConfig = function(e, t) {
        n(e.optimizationToken) && (t.xhrSetup || (t.xhrSetup = function() {}
        ))
    }
    ,
    e.getHiveSourceForReload = function(e, t) {
        return e.off("stop.hiveStop"),
        e.off("finish.hiveFinish"),
        [{
            type: "application/x-mpegurl",
            ticket: t.optimizationToken
        }]
    }
    ,
    e.loadHiveTicket = function(e, n, o, i, a) {
        e.closeHiveSession(),
        e.load(n, o, (function(e) {
            t.info(PanoptoTS.StringHelpers.format("Hive to load ticket: {0} reasons: ", n[0].ticket) + e),
            t.info(PanoptoTS.StringHelpers.format("Falling back to source {0}", i.clip.sources[0].src)),
            a(i, o)
        }
        ))
    }
    ,
    e.addCloseHiveSessionToStopAndFinish = function(e) {
        e.one("stop.hiveStop", (function() {
            e.off("finish.hiveFinish"),
            e.closeHiveSession()
        }
        )),
        e.one("finish.hiveFinish", (function() {
            e.off("stop.hiveStop"),
            e.closeHiveSession()
        }
        ))
    }
    ,
    e
}(Panopto.Viewer.Hive || {}),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.AttachmentTab = function(e, t, n, o, i, a) {
    var r = []
      , s = _.template('\n        <a id="slidesDownload"\n            class="slide-download-link"\n            title="<@- fileName @>"\n            href="<@- slideDownloadHref @>"\n        >\n            <i class="material-icons md-24">file_download</i>\n            <span><@- fileName @></span>\n        </a>\n    ')
      , l = PanoptoLegacy.Viewer.Tabs.ViewerEventTab(e, t, n, o, r, PanoptoViewer.EventType.None, !1, Panopto.Viewer.Analytics.Labels.Attachment, i, a);
    l.render(r, !0, void 0, void 0, void 0);
    var d, c, u;
    return d = t.find("#slideDownloadContainer"),
    c = function(e) {
        var t = {
            id: o,
            tid: i,
            sdid: e
        };
        return Panopto.Core.StringHelpers.addQueryParameter(Panopto.uriScheme + "://" + Panopto.webServerFQDN + Panopto.appRoot + "/Handlers/SlideDeckDownload.ashx", t)
    }
    ,
    u = $.Deferred(),
    Panopto.Core.ServiceInterface.Rest.Sessions.getAllSlideDecks(o, (function(e) {
        u.resolve(e)
    }
    ), (function() {
        u.reject()
    }
    )),
    u.then((function(e) {
        e.filter((function(e) {
            return e.isDownloadAllowed
        }
        )).forEach((function(e) {
            return t = e.id,
            n = e.name,
            o = $(s({
                slideDownloadHref: c(t),
                fileName: n
            })),
            void d.append(o);
            var t, n, o
        }
        ))
    }
    )),
    l
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
PanoptoLegacy.Viewer.Tabs.BookmarksTab = function(e, t, n, o, i, a, r) {
    var s = !1
      , l = PanoptoLegacy.Viewer.Tabs.EditableEventTab(e, t, n, o, [], PanoptoViewer.EventType.Bookmark, !1, i, Panopto.GlobalResources.ViewerPlus_CreateBookmark, Panopto.GlobalResources.ViewerPlus_CreateBookmark_None, Panopto.GlobalResources.ViewerPlus_Bookmarks_SignIn, Panopto.Viewer.Analytics.Labels.Bookmark, void 0, void 0, a, r)
      , d = Panopto.Core.Extensions.base(l)
      , c = t.find(".event-input");
    return l.selected = function(e) {
        return void 0 !== e && e && !s && (c.hide(),
        l.fetch(),
        s = !0),
        Panopto.Core.Browser.inIframe() && !Panopto.viewer.linksEnabledInIframe && $("#allBookmarksLink").hide(),
        d.selected(e)
    }
    ,
    l.render = function(e, t, n, o, a) {
        s && i.key && c.show(),
        d.render(e, t, n, o, a)
    }
    ,
    l
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
PanoptoLegacy.Viewer.Tabs.CommentsTab = function(e, t, n, o, i, a, r, s, l, d, c) {
    var u, p = [], f = PanoptoLegacy.Viewer.Tabs.ViewerEventTab(e, t, n, o, [], PanoptoViewer.EventType.Comment, !1, Panopto.Viewer.Analytics.Labels.Comment, a, c), h = f;
    return f.render = function() {
        u || (u = Panopto.ThreadedComments($("#threadedComments"), {
            sessionId: i,
            deliveryId: o,
            commentPollingInterval: l,
            userKey: Panopto.user.userKey,
            userFullName: Panopto.user.fullNameOrKey,
            inviteTokenId: a,
            isBroadcast: s,
            isTimeShifted: !1,
            isDiscussionDownloadAllowed: d,
            tabId: "threadedCommentsTab",
            paneId: "threadedCommentsPane",
            selected: !0,
            isAuthenticated: Panopto.user.isAuthenticated,
            loginUrl: Panopto.loginUrl,
            sessionsService: Panopto.Core.ServiceInterface.Rest.Sessions,
            resources: Panopto.GlobalResources,
            onAddPositionListener: function(e) {
                p.push(e),
                e(n.position())
            },
            onRemovePositionListener: function(e) {
                p = p.filter((function(t) {
                    return t !== e
                }
                ))
            },
            onContentRowTimeClick: f.seekToEvent
        }))
    }
    ,
    f.position = function(e) {
        s && n.isActiveBroadcast() && n.isLive();
        p.forEach((function(t) {
            return t(e)
        }
        ))
    }
    ,
    h.toggleBroadcastIsLiveOrEnded = function(e) {
        null == u || u.setProps({
            isTimeShifted: !e
        })
    }
    ,
    h.render([], !1, !1, !1, !1),
    f.error(!1),
    f.toggleLoading(!1),
    h
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
PanoptoLegacy.Viewer.Tabs.ContentsTab = function(e, t, n, o, i, a) {
    var r = PanoptoLegacy.Viewer.Tabs.ViewerEventTab(e, t, n, o, [], PanoptoViewer.EventType.Slide, !0, Panopto.Viewer.Analytics.Labels.Content, void 0, a);
    return r.render(i, !0, void 0, void 0, void 0),
    r
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
PanoptoLegacy.Viewer.Tabs.DetailsTab = function(e, t, n, o, i, a, r, s, l, d, c, u, p, f) {
    var h = Panopto.features.tagsEnabled ? PanoptoTS.Viewer.Data.TagHelper.convertDeliveryToModel(r) : []
      , m = !Panopto.Core.Browser.inIframe() || Panopto.viewer.linksEnabledInIframe
      , v = Panopto.DetailsTab($("#detailsTab"), {
        isVisible: !1,
        sessionId: o,
        name: i,
        description: a,
        tags: h,
        ownerId: s,
        ownerFullName: l,
        ownerBio: d,
        linkify: m,
        tagsEnabled: Panopto.features.tagsEnabled,
        tagService: u,
        subscriptionsEnabled: Panopto.features.subscriptionsEnabled,
        subscriptionService: p,
        userService: f,
        resources: Panopto.GlobalResources
    })
      , y = PanoptoLegacy.Viewer.Tabs.EventTab(e, t, n, void 0, [], void 0, !1, void 0, void 0, c);
    return y.onSelectChangeRendered = function(e) {
        var t = e.selected;
        return v.setProps({
            isVisible: t
        })
    }
    ,
    y
}
,
(Panopto = Panopto || {}).Core = Panopto.Core || {},
Panopto.Core.Key = Panopto.Core.Key || {},
Panopto.UI = Panopto.UI || {},
Panopto.UI.Input = Panopto.UI.Input || {},
Panopto.Viewer = Panopto.Viewer || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
Panopto.Viewer.Data = Panopto.Viewer.Data || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
PanoptoLegacy.Viewer.Tabs.EditableEventTab = function(e, t, n, o, i, a, r, s, l, d, c, u, p, f, h, m) {
    var v, y, P = PanoptoTS.Viewer.Constants, g = Panopto.Viewer.Analytics, S = PanoptoLegacy.Viewer.Tabs.ViewerEventTab(e, t, n, o, i, a, r, u, p, m), C = S, w = Panopto.Core.Extensions.base(S);
    t.append(_.template($("#eventTabInputTemplate").html())({}));
    var b, T = t.find(".event-input"), E = t.find(".cancel-editing"), V = "editing", I = 0, k = T.height();
    C.updatePlaceholderText = function() {
        T.attr("placeholder", b || (i.length ? l : d)),
        T.attr("aria-label", l)
    }
    ;
    var R = function(e) {
        e ? (v = e,
        t.find("#" + e.id).toggleClass(V, !0),
        T.val(e.text).focus().select(),
        L(void 0),
        E.show(),
        T.prop("disabled", !1).toggleClass(V, !0)) : (v && (t.find("#" + v.id).toggleClass(V, !1),
        E.hide(),
        T.toggleClass(V, !1)),
        v = void 0,
        T.val(""),
        L(k),
        C.updatePlaceholderText(),
        y = void 0,
        b && T.prop("disabled", !0))
    }
      , D = function(e, n, o, i) {
        var a = t.find("#" + e.id)
          , r = a.find(".event-error");
        r.find(".event-error-message").text(n),
        Panopto.Core.UI.Handlers.button(r.find(".event-error-retry"), o),
        Panopto.Core.UI.Handlers.button(r.find(".event-error-cancel"), i),
        a.toggleClass("errored", !0)
    };
    C.wireUpEditMenu = function(e) {
        var n = t.find("#" + e.id)
          , o = new PanoptoTS.Viewer.Controls.EditEventMenu(n,n.find(".event-edit-toggle"),Panopto.GlobalResources,{
            toggleAppearsOnHover: !0
        });
        o.editCallbacks.add((function(e) {
            C.editEventClicked(e)
        }
        )),
        o.deleteCallbacks.add((function(e) {
            C.deleteEventClicked(e)
        }
        )),
        o.setEvent(e, {
            canEdit: e.editable,
            canDelete: e.deletable
        })
    }
    ,
    C.editEventClicked = function(e) {
        R(!1),
        R(e)
    }
    ,
    C.deleteEventClicked = function(e) {
        e.saved = !1,
        S.render([e], !1, void 0, void 0, void 0),
        C.deleteEvent(e)
    }
    ;
    var L = function(e) {
        var t = T.innerHeight() - T.height();
        T.height(1);
        var n = T[0].scrollHeight
          , o = e || n - t;
        T.height(o)
    };
    if (s.key)
        T.keyup((function() {
            var e = jQuery.trim(T.val());
            e && void 0 === y ? y = C.getEventTime() : e || (y = void 0)
        }
        )),
        T.on("paste input", (function() {
            L(void 0)
        }
        )),
        T.keydown((function(e) {
            e.ctrlKey && e.keyCode === Panopto.Core.Key.UpArrow || (e.stopPropagation(),
            e.keyCode !== Panopto.Core.Key.Enter || e.shiftKey ? e.keyCode === Panopto.Core.Key.Esc && C.resetInput() : (e.preventDefault(),
            void 0 === y && T.keyup(),
            C.submitEvent(void 0)))
        }
        )),
        Panopto.Core.UI.Handlers.button(E, (function() {
            R(!1)
        }
        )),
        l && C.updatePlaceholderText();
    else {
        T.hide();
        var x = _.template($("#eventTabSignInTemplate").html());
        t.find(".event-signin").html(PanoptoTS.StringHelpers.format(c, x({
            url: PanoptoTS.StringHelpers.format("{0}?ReturnUrl={1}", Panopto.loginUrl, encodeURIComponent(window.location.href)),
            text: Panopto.GlobalResources.ViewerPlus_EventTab_SignIn
        }))).show()
    }
    return S.resize = function(e, t) {
        var n = T.is(":visible") ? T.outerHeight(!0) : 0;
        E.is(":visible") && (n += E.outerHeight(!0)),
        T.width(e - P.InputMargin),
        w.resize(e, t - n)
    }
    ,
    S.render = function(e, t) {
        s.key && _.each(e, (function(e) {
            e.editable = e.saved && e.user === s.key,
            e.deletable = e.saved && (e.editable || s.role > Panopto.Data.AclRoleType.Viewer)
        }
        )),
        f && _.each(e, (function(e) {
            delete e.time
        }
        )),
        w.render(e, t),
        _.each(e, (function(e) {
            (e.editable || e.deletable) && C.wireUpEditMenu(e)
        }
        )),
        C.updatePlaceholderText(),
        n.resize()
    }
    ,
    S.remove = function(e) {
        w.remove(e),
        C.updatePlaceholderText()
    }
    ,
    C.addEvent = function(e, t, n, i) {
        m.createEvent(o, a, e.text, t, !f, n, h, (function(t) {
            e.eventId = t.EventID,
            e.eventPublicId = t.PublicId,
            e.sessionId = t.SessionId,
            e.saved = !0,
            S.render([e], !1, void 0, void 0, void 0),
            S.toggleLoading(!1),
            g.sendEvent({
                action: g.Actions.Add.Success,
                label: u
            }),
            i && i()
        }
        ), (function() {
            D(e, Panopto.GlobalResources.ViewerPlus_EventTab_AddError, (function() {
                C.addEvent(e, t, n, i),
                g.sendEvent({
                    action: g.Actions.Add.Retry,
                    label: u
                })
            }
            ), (function() {
                S.remove([e]),
                g.sendEvent({
                    action: g.Actions.Add.Cancel,
                    label: u
                })
            }
            )),
            S.toggleLoading(!1),
            g.sendEvent({
                action: g.Actions.Add.Error,
                label: u
            }),
            i && i()
        }
        ))
    }
    ,
    C.editEvent = function(e, t, n) {
        m.editEvent(e.sessionId, e.type || a, e.eventPublicId, e.text, (function() {
            e.saved = !0,
            S.render([e], !1, void 0, void 0, void 0),
            S.toggleLoading(!1),
            g.sendEvent({
                action: g.Actions.Edit.Success,
                label: u
            }),
            n && n()
        }
        ), (function() {
            D(e, Panopto.GlobalResources.ViewerPlus_EventTab_EditError, (function() {
                C.editEvent(e, t, n),
                g.sendEvent({
                    action: g.Actions.Edit.Retry,
                    label: u
                })
            }
            ), (function() {
                e.text = t,
                e.saved = !0,
                S.render([e], !1, void 0, void 0, void 0),
                g.sendEvent({
                    action: g.Actions.Edit.Cancel,
                    label: u
                })
            }
            )),
            S.toggleLoading(!1),
            g.sendEvent({
                action: g.Actions.Edit.Error,
                label: u
            }),
            n && n()
        }
        ))
    }
    ,
    C.deleteEvent = function(e, t) {
        S.toggleLoading(!0),
        m.deleteEvent(e.sessionId, e.type || a, e.eventPublicId, (function() {
            e === v && R(!1),
            S.remove([e]),
            S.toggleLoading(!1),
            g.sendEvent({
                action: g.Actions.Delete.Success,
                label: u
            }),
            t && t()
        }
        ), (function() {
            D(e, Panopto.GlobalResources.ViewerPlus_EventTab_DeleteError, (function() {
                C.deleteEvent(e, t),
                g.sendEvent({
                    action: g.Actions.Delete.Retry,
                    label: u
                })
            }
            ), (function() {
                e.saved = !0,
                C.render([e], !1, void 0, void 0, void 0),
                g.sendEvent({
                    action: g.Actions.Delete.Cancel,
                    label: u
                })
            }
            )),
            S.toggleLoading(!1),
            g.sendEvent({
                action: g.Actions.Delete.Error,
                label: u
            }),
            t && t()
        }
        ))
    }
    ,
    C.submitEvent = function(e) {
        var t, n, o = jQuery.trim(T.val());
        o && (T.val(""),
        L(k),
        S.toggleLoading(!0),
        v ? (t = v,
        R(!1),
        n = t.text,
        t.text = o,
        t.saved = !1,
        S.render([t], !1, void 0, void 0, void 0),
        C.editEvent(t, n)) : C.saveNewEvent(o, y, e))
    }
    ,
    C.saveNewEvent = function(e, t, n) {
        var o = f ? t - (new Date).getTime() / 1e3 : t
          , i = {
            id: a + I.toString(),
            text: e,
            time: t,
            creationTime: Panopto.Core.TimeHelpers.currentWin32EpochTime(),
            user: s.key,
            userDisplayName: Panopto.viewer.displayFullNamesInDiscussion ? s.name : s.key
        };
        S.render([i], !1, void 0, void 0, void 0),
        y = void 0,
        I++,
        C.addEvent(i, o, n),
        C.focusEvent(i)
    }
    ,
    C.inputDisabled = function(e) {
        if (void 0 === e)
            return !!b;
        v && R(!1),
        b = e,
        T.prop("disabled", !!b).val(""),
        C.updatePlaceholderText()
    }
    ,
    C.isInputDisabled = C.inputDisabled,
    C.getEventTime = function() {
        return f ? (new Date).getTime() / 1e3 : n.position()
    }
    ,
    C.resetInput = function() {
        R(!1)
    }
    ,
    C.focusEvent = function(e) {}
    ,
    C
}
,
(Panopto = Panopto || {}).UI = Panopto.UI || {},
Panopto.UI.Components = Panopto.UI.Components || {},
Panopto.UI.Accessibility = Panopto.UI.Accessibility || {},
Panopto.Viewer = Panopto.Viewer || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
Panopto.Viewer.Data = Panopto.Viewer.Data || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
PanoptoLegacy.Viewer.Tabs.EventTab = function(e, t, n, o, i, a, r, s, l, d) {
    var c = PanoptoTS.Viewer.Constants
      , u = Panopto.Viewer.Analytics
      , p = {};
    t.prepend(_.template($("#eventTabErrorTemplate").html())({}));
    var f, h, m = $("#eventTemplate"), v = t.find(".event-tab-scroll-pane"), y = t.find(".event-tab-list"), P = t.find(".event-tab-spinner"), g = t.find(".event-tab-error"), S = t.find(".event-tab-help"), C = !1, w = Panopto.Core.UI.Components.scrollingHighlight(v, !0, c.EventScrollTimeout), b = function(e) {
        w.highlight(_.find(i, (function(t) {
            return t.id === e.id
        }
        )), (function(e) {
            p.seekToEvent(e)
        }
        ))
    };
    p.seekToEvent = function(e) {
        n.userSeekEnabled() && (n.setPosition(e.time),
        u.sendEvent({
            action: u.Actions.Navigate,
            label: s
        }))
    }
    ;
    var T = function(e, t) {
        var n = a === PanoptoViewer.EventType.Comment ? e.creationTime - t.creationTime : e.time - t.time;
        return n || e.id === t.id || (n = e.id < t.id ? -1 : 1),
        n
    }
      , E = Panopto.Core.UI.Accessibility.tab(e, t)
      , V = !Panopto.Core.Browser.inIframe() || Panopto.viewer.linksEnabledInIframe;
    return Panopto.Branding.animateLoadingIndicator(Panopto.branding.accentColor),
    p.isHeaderVisible = function() {
        return C
    }
    ,
    p.toggleHeader = function(t) {
        C = t,
        e.toggle(t)
    }
    ,
    p.toggleHeader(!0),
    y.keydown((function(e) {
        if (!e.ctrlKey && _.contains([c.VolumeUpKeyCode, c.VolumeDownKeyCode], e.keyCode) && e.stopPropagation(),
        e.keyCode === Panopto.Core.Key.UpArrow || e.keyCode === Panopto.Core.Key.RightArrow || e.keyCode === Panopto.Core.Key.DownArrow || e.keyCode === Panopto.Core.Key.LeftArrow) {
            var t = y.find(".index-event:focus")
              , n = void 0;
            e.keyCode === Panopto.Core.Key.UpArrow || e.keyCode === Panopto.Core.Key.LeftArrow ? n = t.prev(".index-event") : e.keyCode !== Panopto.Core.Key.DownArrow && e.keyCode !== Panopto.Core.Key.RightArrow || (n = t.next(".index-event")),
            n.length && (t.attr("tabindex", -1),
            n.focus(),
            n.attr("tabindex", 0)),
            e.stopPropagation()
        }
    }
    )),
    S.toggle(V),
    Panopto.Core.UI.Handlers.button(e, (function() {
        return n.fireTabSelected(p)
    }
    )),
    e.focus((function() {
        return n.fireTabSelected(p)
    }
    )),
    p.isSameEventRendering = function(e, t) {
        return e.id === t.id && (void 0 === e.displayTime || void 0 === t.displayTime || e.displayTime === t.displayTime) && e.inlineEditable === t.inlineEditable && e.text === t.text && e.showUser === t.showUser && e.userDisplayName === t.userDisplayName && e.time === t.time && e.timeRange === t.timeRange && e.editable === t.editable && e.deletable === t.deletable
    }
    ,
    p.selected = function(o) {
        if (void 0 === o)
            return e.hasClass("selected");
        e.toggleClass("selected", o),
        o ? t.delay(c.FadeInterval).fadeIn(c.FadeInterval, (function() {
            var e;
            n.resize(),
            null === (e = p.onSelectChangeRendered) || void 0 === e || e.call(p, {
                selected: !0
            })
        }
        )) : t.fadeOut(c.FadeInterval, (function() {
            var e;
            return null === (e = p.onSelectChangeRendered) || void 0 === e ? void 0 : e.call(p, {
                selected: !1
            })
        }
        )),
        E.selected(o)
    }
    ,
    p.headerId = function() {
        return e.attr("id")
    }
    ,
    p.resize = function(e, n) {
        e === f && n === h || (f = e,
        h = n,
        v.css("max-height", n + "px"),
        t.width(e))
    }
    ,
    p.position = function(e) {
        var t;
        r && (_.each(i, (function(n) {
            n.time <= e && (t = n)
        }
        )),
        w.highlight(t))
    }
    ,
    p.render = function(e, t, o, r, s) {
        if (o || e.sort(T),
        r) {
            var l = function(e) {
                for (var t = [], n = [], o = 0, a = 0; o < i.length && a < e.length; ) {
                    var r = i[o]
                      , s = e[a]
                      , l = T(r, s);
                    0 === l ? (p.isSameEventRendering(r, s) || (t.push(s),
                    n.push(r)),
                    o++,
                    a++) : l < 0 ? (n.push(r),
                    o++) : (t.push(s),
                    a++)
                }
                for (; o < i.length; )
                    n.push(i[o]),
                    o++;
                for (; a < e.length; )
                    t.push(e[a]),
                    a++;
                return {
                    eventsToAdd: t,
                    eventsToRemove: n
                }
            }(e);
            e = l.eventsToAdd,
            _.each(l.eventsToRemove, (function(e) {
                i.splice(i.indexOf(e), 1),
                y.find("#" + e.id).remove()
            }
            ))
        }
        _.each(e, (function(e) {
            var t;
            "number" != typeof e.time || e.displayTime || (e.displayTime = Panopto.Core.TimeHelpers.formatDuration(e.time, Panopto.GlobalResources.TimeSeparator)),
            !e.creationTime || a !== PanoptoViewer.EventType.Comment && e.type !== PanoptoViewer.EventType.Comment && e.displayTime || (t = Panopto.Core.TimeHelpers.toLocalPanoptoTime(Panopto.Core.TimeHelpers.formatWin32EpochTimeToDate(e.creationTime), Panopto.timeZone),
            e.displayDate = Panopto.GlobalResources.ViewerPlus_CommentTimestamp.format(Panopto.Core.TimeHelpers.utcDateToFormattedString(t, "LL"), Panopto.Core.TimeHelpers.utcDateToFormattedString(t, "LT"), e.userDisplayName)),
            e.isQuestionList ? e.iconCode = Panopto.Core.Constants.QuestionListIconCode : e.url && -1 !== e.url.indexOf(PanoptoViewer.Constants.YouTubeEmbedBaseUrl) && (e.iconClass = PanoptoTS.Viewer.Constants.YouTubeIconClass),
            n.isActiveBroadcast() && (e.createdDuringWebcast = !1);
            var o = Panopto.Core.TextHelpers.cleanTextWithHighlighting(e.text);
            V && (o = Panopto.Core.TextHelpers.urlsToLinks(o, {
                preserveHtml: !0
            })),
            e.content = Panopto.Core.TextHelpers.displayLineBreaks(o)
        }
        ));
        var d = _.template(m.html());
        !r && t ? (i.length = 0,
        _.each(e, (function(e) {
            i.push(e)
        }
        )),
        y.html(d({
            events: e
        })),
        _.each(i, (function(e) {
            p.afterRenderItem(e, y.find("#" + e.id), !1)
        }
        ))) : _.each(e, (function(e) {
            var t, n, o = d({
                events: [e]
            }), a = _.findIndex(i, (function(t) {
                return t.eventId === e.eventId
            }
            )), r = !1;
            if (a >= 0) {
                r = (n = y.find("#" + e.id)).hasClass(Panopto.Core.Constants.HighlightedClass) && !s;
                var l = $.parseHTML($.trim(o));
                n.replaceWith(l),
                n = $(l),
                i[a] = e
            } else {
                i.push(e),
                i.sort(T),
                r = !s,
                t = i.indexOf(e);
                var c = $.parseHTML($.trim(o));
                0 === t ? y.prepend(c) : t === i.length - 1 ? y.append(c) : y.find("#" + i[t - 1].id).after(c),
                n = $(c)
            }
            p.afterRenderItem(e, n, r)
        }
        ))
    }
    ,
    p.afterRenderItem = function(e, t, n) {
        e.displayTime && Panopto.Core.UI.Handlers.button(y.find("#" + e.id), b),
        n && w.highlight(e),
        t.find("a").unbind("click keydown").click((function(e) {
            e.stopPropagation()
        }
        )).keydown((function(e) {
            e.stopPropagation()
        }
        ))
    }
    ,
    p.remove = function(e) {
        _.each(e, (function(e) {
            var t = y.find("#" + e.id);
            t.slideUp(void 0, (function() {
                t.remove()
            }
            )),
            i.splice(i.indexOf(e), 1)
        }
        ))
    }
    ,
    p.toggleLoading = function(e) {
        P.toggle(e)
    }
    ,
    p.error = function(e, t) {
        e ? (g.find(".event-tab-error-message").text(e),
        Panopto.Core.UI.Handlers.button(g.find(".event-tab-error-retry"), t),
        Panopto.Core.UI.Handlers.button(g.find(".event-tab-error-cancel"), (function() {
            p.error(!1)
        }
        )),
        g.slideDown()) : g.slideUp()
    }
    ,
    p.fetch = function(e, t, n, i, r) {
        i = i || a,
        p.toggleLoading(!0),
        d.search(o, i, e, t, n, l, !r, (function(e) {
            p.render(_.map(e, (function(e) {
                return new PanoptoTS.Viewer.Data.Event(e)
            }
            )), !0, void 0, void 0, void 0),
            p.error(!1),
            p.toggleLoading(!1)
        }
        ), (function() {
            p.fetchError(e, t, n, i)
        }
        ))
    }
    ,
    p.fetchError = function(e, t, n, o) {
        p.error(Panopto.GlobalResources.ViewerPlus_EventTab_LoadError, (function() {
            p.fetch(e, t, n, o)
        }
        )),
        p.toggleLoading(!1)
    }
    ,
    p.events = function() {
        return i
    }
    ,
    p
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Data = Panopto.Viewer.Data || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
PanoptoLegacy.Viewer.Tabs.NotesTab = function(e, t, n, o, i, a, r, s, l, d, c) {
    var u, p, f, h = Panopto.Viewer.Data, m = PanoptoTS.Viewer.Constants, v = !1, y = PanoptoLegacy.Viewer.Tabs.EditableEventTab(e, t, n, o, [], PanoptoViewer.EventType.Note, !0, a, Panopto.GlobalResources.ViewerPlus_AddNote, Panopto.GlobalResources.ViewerPlus_AddNote_None, Panopto.GlobalResources.ViewerPlus_Notes_SignIn, Panopto.Viewer.Analytics.Labels.Note, void 0, l, d, c), P = y, g = Panopto.Core.Extensions.base(y), S = [], C = "public", w = t.find("#channelSingleLabel"), b = t.find("#channelSelect"), T = t.find("#channelInput"), E = t.find("#channelOptionTemplate"), V = t.find("#togglePublic"), I = t.find("#notesDownload"), k = t.find("#cancelChannel"), R = t.find(".event-input"), D = function(e) {
        b.val(e.value),
        b.change()
    }, L = function(e) {
        b.toggle(e),
        V.toggle(s && e && r && u === p),
        T.toggle(!e),
        k.toggle(!e)
    }, x = function(e) {
        V.text(e ? Panopto.GlobalResources.ViewerPlus_MakePrivate : Panopto.GlobalResources.ViewerPlus_MakePublic),
        V.toggleClass(C, e)
    }, O = function() {
        y.toggleLoading(!0),
        c.toggleEventPrivacy(o, !V.hasClass(C), (function(e) {
            x(e.Public),
            y.error(!1),
            y.toggleLoading(!1)
        }
        ), (function() {
            var e = V.hasClass(C) ? Panopto.GlobalResources.ViewerPlus_EventTab_TogglePrivateError : Panopto.GlobalResources.ViewerPlus_EventTab_TogglePublicError;
            y.error(e, (function() {
                O()
            }
            )),
            y.toggleLoading(!1)
        }
        ))
    }, U = Panopto.GlobalResources.ViewerPlus_YourNotes.format(a.key);
    if (w.text(U),
    p = h.Channel("", U),
    S.push(p),
    r && _.each(r, (function(e) {
        e.value.toLowerCase() !== a.key && S.push(e)
    }
    )),
    Panopto.viewer.isCustomNotesChannelEnabled && S.push(h.Channel(m.JoinChannelOptionValue, Panopto.GlobalResources.ViewerPlus_JoinChannel)),
    b.html(_.template(E.html())({
        channels: S
    })),
    f = b.find("option[value='" + m.JoinChannelOptionValue + "']"),
    b.change((function() {
        var e = b.val();
        e === m.JoinChannelOptionValue ? (L(!1),
        T.focus()) : (u = _.find(S, (function(t) {
            return t.value === e
        }
        )),
        v && y.fetch(),
        I.attr("href", A()),
        V.toggle(s && r && e === p.value))
    }
    )),
    b.keydown((function(e) {
        return e.stopPropagation()
    }
    )),
    w.toggle(1 === S.length),
    b.toggle(S.length > 1),
    r) {
        Panopto.Core.UI.Handlers.button(V, O);
        var M = _.find(r, (function(e) {
            return e.name.toLowerCase() === a.key
        }
        ));
        x(void 0 !== M),
        V.toggle(s)
    }
    T.keydown((function(e) {
        var t, n, o = jQuery.trim(T.val());
        13 === e.keyCode && (e.preventDefault(),
        o && o !== m.JoinChannelOptionValue && ((t = _.find(S, (function(e) {
            return e.value === o
        }
        ))) || (n = h.Channel(o),
        f.before(_.template(E.html())({
            channels: [n]
        })),
        S.splice(S.length - 2, 0, n),
        T.val(""),
        t = n),
        L(!0),
        D(t))),
        e.stopPropagation()
    }
    )),
    Panopto.Core.UI.Handlers.button(k, (function() {
        T.val(""),
        D(u),
        L(!0)
    }
    )),
    y.render = function(e, t) {
        v && a.key && R.show(),
        _.each(e, (function(e) {
            e.showUser = e.user !== a.key
        }
        )),
        g.render(e, t)
    }
    ,
    y.fetch = function() {
        u === p ? g.fetch() : u.isUser ? g.fetch("", u.value) : g.fetch("", "", u.value)
    }
    ;
    var A = function() {
        var e, t;
        u === p || (u.isUser ? e = u.value : t = u.value);
        var n = {
            id: o,
            tid: i,
            notesUser: e,
            channelName: t
        };
        return Panopto.Core.StringHelpers.addQueryParameter(Panopto.uriScheme + "://" + Panopto.webServerFQDN + Panopto.appRoot + "/Handlers/NotesDownload.ashx", n)
    };
    return P.submitEvent = function() {
        var e = b.val();
        e === m.JoinChannelOptionValue && (e = jQuery.trim(T.val())),
        e ? g.submitEvent(e) : g.submitEvent(u.value)
    }
    ,
    y.selected = function(e) {
        return void 0 !== e && e && !v && (R.hide(),
        y.fetch(),
        v = !0),
        g.selected(e)
    }
    ,
    D(S[0]),
    P
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.PlayerTabHeader = function(e, t, n, o, i) {
    var a, r, s = e.find(".player-seek-text"), l = !1;
    return e.addClass(o ? PanoptoTS.Viewer.Constants.PrimaryTabHeaderClass : PanoptoTS.Viewer.Constants.SecondaryTabHeaderClass),
    i && e.find(".player-tab-wrapper > i").html(i),
    Panopto.Core.UI.Handlers.hoverableParent(e, s, (function(t) {
        e.hasClass(Panopto.Core.Constants.InactiveClass) && !e.hasClass(Panopto.Core.Constants.DisabledClass) && t ? (s.show(),
        Panopto.viewer.allowMultipleSecondaryDisplay || s.css("left", (e.filter(":visible").width() - s.filter(":visible").outerWidth()) / 2)) : s.hide()
    }
    )),
    {
        available: function(t) {
            var o = PanoptoTS.Viewer.Logic.TimelineLogic.isOnTimeline(n, t);
            e.toggleClass(Panopto.Core.Constants.InactiveClass, !o),
            !o && r && e.blur(),
            r = o;
            var i = _.find(n, (function(e) {
                return e > t
            }
            ));
            return o ? (a = void 0,
            s.text("")) : (a = i || n[0],
            s.text(Panopto.GlobalResources.ViewerPlus_SecondarySeekText.format(Panopto.Core.TimeHelpers.formatDuration(a, Panopto.GlobalResources.TimeSeparator)))),
            o
        },
        selected: function(t) {
            if (void 0 === t)
                return l;
            e.toggleClass(Panopto.Core.Constants.SelectedClass, t),
            t && !l && s.hide(),
            e.attr("aria-pressed", t),
            l = t
        },
        owns: function(t) {
            return 1 === e.filter((function() {
                return this === t
            }
            )).length
        },
        id: function() {
            return t
        },
        seekTime: function() {
            return a
        },
        timeline: function(e) {
            n = e
        }
    }
}
,
(Panopto = Panopto || {}).UI = Panopto.UI || {},
Panopto.UI.Input = Panopto.UI.Input || {},
Panopto.Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
PanoptoLegacy.Viewer.Tabs.SearchTab = function(e, t, n, o, i, a, r) {
    var s, l = PanoptoTS.Viewer.Constants, d = [], c = PanoptoLegacy.Viewer.Tabs.ViewerEventTab(e, t, n, o, d, PanoptoViewer.EventType.None, !1, Panopto.Viewer.Analytics.Labels.Search, a, r), u = c, p = Panopto.Core.Extensions.base(c), f = "searchable", h = $("#searchRegion"), m = h.find("#searchInput"), v = h.find("#searchButton"), y = h.find("#clearButton"), P = t.find("#searchTypeSelect"), g = t.find("#searchSortSelect");
    h.toggle(!0),
    c.toggleHeader(!1);
    var S = [{
        value: "",
        name: Panopto.GlobalResources.ViewerPlus_Search_All
    }];
    return PanoptoCore.forEachEnum(PanoptoViewer.EventType, (function(e, t) {
        S.push({
            value: t,
            name: Panopto.GlobalResources[l.SearchTypeResourceString.format(e)]
        })
    }
    )),
    P.html(_.template($("#searchOptionTemplate").html())({
        searchOptions: S
    })),
    g.html(_.template($("#searchOptionTemplate").html())({
        searchOptions: l.SearchSortOrders
    })),
    m.keydown((function(e) {
        e.keyCode === Panopto.Core.Key.Enter && c.fetch(),
        e.stopPropagation()
    }
    )),
    m.keyup((function() {
        h.toggleClass(f, "" !== jQuery.trim(m.val()))
    }
    )),
    m.focus((function() {
        h.toggleClass(f, "" !== jQuery.trim(m.val())),
        n.fireFocused()
    }
    )),
    u.setQueryText = function(e) {
        m.val(e)
    }
    ,
    P.change((function() {
        c.fetch()
    }
    )),
    P.keydown((function(e) {
        return e.stopPropagation()
    }
    )),
    g.change((function() {
        var e = [];
        _.each(d, (function(t) {
            e.push(t)
        }
        )),
        g.val() === l.SortTimeValue ? c.render(e, void 0, void 0, void 0, void 0) : c.fetch()
    }
    )),
    g.keydown((function(e) {
        return e.stopPropagation()
    }
    )),
    Panopto.Core.UI.Handlers.button(v, (function() {
        c.fetch()
    }
    )),
    Panopto.Core.UI.Handlers.button(y, (function() {
        m.val(""),
        h.removeClass(f),
        m.focus(),
        c.fetch()
    }
    )),
    m.attr("placeholder", Panopto.GlobalResources.ViewerPlus_SearchHeader),
    c.selected = function(e) {
        if (void 0 === e)
            return p.selected();
        p.selected(e),
        h.toggleClass(Panopto.Core.Constants.SelectedClass, e)
    }
    ,
    c.render = function(e) {
        _.each(e, (function(e) {
            e.iconClass = e.type,
            e.type === PanoptoViewer.EventType.Note && (i && i.key === e.user || (e.showUser = !0))
        }
        )),
        p.render(e, !0, g.val() === l.SortRelevanceValue),
        s && t.find("#searchResultsAria").text(1 === e.length ? Panopto.GlobalResources.ViewerPlus_Search_Results_Singular : PanoptoTS.StringHelpers.format(Panopto.GlobalResources.ViewerPlus_Search_Results_Plural, e.length)),
        e.length ? t.find(".index-event").first().focus() : t.find("#searchResultsMessage").html(PanoptoTS.StringHelpers.format(Panopto.GlobalResources.ViewerPlus_Search_NoResults, PanoptoTS.StringHelpers.format("<span class='match'>{0}</span>", Panopto.Core.TextHelpers.cleanTextWithHighlighting(s)))),
        t.find("#searchResultsMessage").toggle(!e.length)
    }
    ,
    c.fetch = function() {
        s = jQuery.trim(m.val()),
        h.toggleClass("search-active", !!s),
        c.toggleHeader(!!s),
        n.fireSearchStarted(s),
        p.fetch(s, "", "", P.val())
    }
    ,
    u
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
Panopto.Viewer.Tabs.SecondaryTab = function(e, t, n, o) {
    var i, a, r = Panopto.Viewer.Analytics, s = PanoptoTS.Viewer.Constants, l = $(), d = !0, c = function(e) {
        if (void 0 === e)
            return d;
        d = e,
        i.toggleClass(Panopto.Core.Constants.DisabledClass, !d),
        l.attr("aria-disabled", String(!d))
    }, u = function(i, s) {
        if (void 0 === i)
            return a.selected();
        if (t.toggle(i),
        i && !a.selected()) {
            if (Panopto.viewer.viewerWatermarkPosition && 0 === e.getContent().find(".logo-while-playing").length) {
                var d = new PanoptoViewer.WatermarkLogo(Panopto.branding.embedLogo.png,Panopto.viewer.viewerWatermarkPosition);
                e.getContent().append(d.getBrandElem()),
                Panopto.viewer.viewerWatermarkPosition === PanoptoViewer.Data.ViewerWatermarkPositionOptions.TopRight && d.setOffset(50)
            }
            e.setContentClass(n.tabClass),
            t.setContent(n, !1, null),
            e.setSelectedText(n.title),
            e.setSelectedIcon(o, n.iconClass),
            s && r.sendEvent({
                action: r.Actions.SecondaryTab,
                label: n.tabClass
            })
        }
        a.selected(i),
        l.attr("aria-checked", String(!!i))
    }, p = function(e, n, o, i) {
        var a = t;
        return a.setSecondaryPosition ? a.setSecondaryPosition(e, n, o, i) : t.setPosition(e, i)
    }, f = function(e) {
        n = e,
        a.timeline(e.timeline),
        a.selected() && t.setContent(e, !1, null)
    };
    return {
        getPlayer: function() {
            return t
        },
        render: function() {
            if (n.hiddenTab)
                i = $();
            else {
                var t = _.template($("#playerTabHeaderTemplate").html().trim())
                  , r = $(t({
                    content: n,
                    type: "inline",
                    tabindex: 0
                }))
                  , s = $(t({
                    content: n,
                    type: "flyout",
                    tabindex: 0
                }));
                (l = r.add(s)).attr("role", "menuitemradio").attr("aria-checked", "false").attr("aria-label", _.escape(n.title)),
                e.addTab(r[0], s[0]),
                i = r.add(s)
            }
            a = Panopto.Viewer.Tabs.PlayerTabHeader(i, n.id, n.timeline, !1, o)
        },
        remove: function() {
            t.remove(),
            i.remove()
        },
        position: p,
        setPosition: p,
        playState: function(e) {
            t.playState(e)
        },
        bitrate: function(e) {
            t.bitrate(e)
        },
        numericBitrate: function() {
            return t.numericBitrate()
        },
        hasMBR: function() {
            return t.hasMBR()
        },
        bitrateLevelOffset: function() {
            return t.bitrateLevelOffset()
        },
        playSpeed: function(e) {
            t.playSpeed(e)
        },
        content: function(e) {
            if (void 0 === e)
                return n;
            f(e)
        },
        setContent: f,
        resize: function(e, n) {
            t.resize(e, n)
        },
        available: function(e) {
            return a.available(e)
        },
        timeline: function() {
            return n.timeline
        },
        relativeStartTime: function() {
            return n.relativeStartTime
        },
        absoluteStartTime: function() {
            return n.absoluteStartTime
        },
        selected: u,
        setSelected: u,
        id: function() {
            return a.id()
        },
        owns: function(e) {
            return a.owns(e)
        },
        seekTime: function() {
            return a.seekTime()
        },
        pauseWhenAvailable: function() {
            return n.pauseWhenAvailable
        },
        isSessionPlaybackBlocking: function() {
            return n.isSessionPlaybackBlocking
        },
        hiddenTab: function() {
            return n.hiddenTab
        },
        adjustTimeline: function(e) {
            var t = e - s.TimedSyncRate / 1e3 * 1.5;
            n.pauseWhenAvailable && n.timeline[0] > t && (n.timeline[0] = t)
        },
        enabled: c,
        setEnabled: c
    }
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
Panopto.Viewer.Tabs.TranscriptTab = function(e, t, n, o, i, a, r) {
    var s = t.find("#languageSelect")
      , l = _.template(t.find("#transcriptOptionTemplate").html())
      , d = a.map((function(e) {
        return {
            code: e,
            name: PanoptoCore.ContentLanguageFriendly[PanoptoCore.ContentLanguage[e]] || Panopto.GlobalResources.Admin_Captions_NoLanguage
        }
    }
    ));
    s.html(l({
        languageList: d
    })),
    a.length <= 1 && s.hide();
    var c = PanoptoLegacy.Viewer.Tabs.ViewerEventTab(e, t, n, o.id, [], PanoptoViewer.EventType.Transcript, !0, Panopto.Viewer.Analytics.Labels.Transcript, i, r);
    return s.change((function() {
        c.fetch()
    }
    )),
    c.fetch = function() {
        c.toggleLoading(!0),
        r.getCaptions(o.id, i, s.val(), (function(e) {
            o.captions = _.map(e, (function(e) {
                return new PanoptoTS.Viewer.Data.Event(e)
            }
            )),
            c.render(o.captions, !0, void 0, void 0, void 0),
            c.error(!1),
            c.toggleLoading(!1)
        }
        ), (function() {
            c.fetchError(void 0, void 0, void 0, void 0),
            c.toggleLoading(!1)
        }
        ))
    }
    ,
    c.fetch(),
    c
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
PanoptoLegacy.Viewer.Tabs.ViewerEventTab = function(e, t, n, o, i, a, r, s, l, d) {
    var c = PanoptoLegacy.Viewer.Tabs.EventTab(e, t, n, o, i, a, r, s, l, d)
      , u = Panopto.Core.Extensions.base(c);
    return c.render = function(e, t, n, o, i) {
        e = _.filter(e, (function(e) {
            return !!jQuery.trim(e.text)
        }
        )),
        u.render(e, t, n, o, i)
    }
    ,
    c
}
,
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e() {}
                return e.create = function(e, t, n, o) {
                    return {
                        userSeekEnabled: e.userSeekEnabled,
                        setPosition: e.setPosition,
                        resize: function() {
                            e.resize && e.resize()
                        },
                        isActiveBroadcast: e.isActiveBroadcast,
                        fireFocused: t,
                        isLive: e.isLive,
                        position: e.position,
                        getPosition: e.getPosition,
                        activePrimary: e.activePrimary,
                        activeSecondary: e.activeSecondary,
                        hotkey: e.hotkey,
                        toggleScreens: e.toggleScreens,
                        setSecondaryCount: e.setSecondaryCount,
                        reinitializeDelivery: e.reinitializeDelivery,
                        synchronize: e.synchronize,
                        viewMode: function(t) {
                            var n;
                            return e.viewMode && (n = e.viewMode(t)),
                            n
                        },
                        fireTabSelected: n,
                        fireSearchStarted: o
                    }
                }
                ,
                e
            }();
            e.ViewerEventTabHelpers = t
        }(e.Tabs || (e.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e() {}
                return e.toLogLine = function(e, t, n, o, i) {
                    return e + "\t" + t + "\t" + n + "\t" + o + (void 0 !== i ? "\t" + i : "")
                }
                ,
                e.fromLogLine = function(e) {
                    var t = e.split("\t");
                    return {
                        source: t[0].toLowerCase(),
                        time: parseInt(t[1]),
                        playerName: t[2],
                        type: t[3].toLowerCase(),
                        value: t[4]
                    }
                }
                ,
                e
            }();
            e.PlayerScriptEvent = t,
            function(e) {
                e[e.LogInput = "loginput"] = "LogInput",
                e[e.LogOutput = "logoutput"] = "LogOutput",
                e[e.LogDefer = "logdefer"] = "LogDefer",
                e[e.None = "none"] = "None",
                e[e.LogInputAndOutput = "loginputandoutput"] = "LogInputAndOutput"
            }(e.ViewerEventSource || (e.ViewerEventSource = {})),
            function(e) {
                e[e.Load = "load"] = "Load",
                e[e.Play = "play"] = "Play",
                e[e.Pause = "pause"] = "Pause",
                e[e.Stop = "stop"] = "Stop",
                e[e.Seek = "seek"] = "Seek",
                e[e.Speed = "speed"] = "Speed",
                e[e.Bitrate = "bitrate"] = "Bitrate",
                e[e.Fullscreen = "fullscreen"] = "Fullscreen",
                e[e.Volume = "volume"] = "Volume",
                e[e.Mute = "mute"] = "Mute"
            }(e.ViewerEventType || (e.ViewerEventType = {}))
        }(e.Test || (e.Test = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = function() {
                function e(e) {
                    this.script = this.parseScriptBlob(e),
                    this.playerNames = _.uniq(_.pluck(this.script, "playerName"))
                }
                return e.prototype.getPlayerNames = function() {
                    return this.playerNames
                }
                ,
                e.prototype.start = function(e, t, n, i, a) {
                    var r = {};
                    _.each(t, (function(e) {
                        var t = $.parseHTML("<div />");
                        i.append(t),
                        r[e] = new o(e,$(t),n)
                    }
                    )),
                    this.beginScript(e, r, a)
                }
                ,
                e.prototype.beginScript = function(e, t, n) {
                    var o, i, a = this, r = -1, s = function() {
                        do {
                            r++
                        } while (r < a.script.length && (!t[a.script[r].playerName] || a.script[r].source !== e));
                        r < a.script.length ? l() : n && n()
                    }, l = function() {
                        var e, n = a.script[r];
                        o ? e = n.time - o - ((new Date).getTime() - i) : (i = (new Date).getTime(),
                        o = n.time,
                        e = 0),
                        e > 30 ? setTimeout(l, e - 30) : e > 4 ? setTimeout(l) : (t[n.playerName].runEvent(n, o - i),
                        s())
                    };
                    s()
                }
                ,
                e.prototype.parseScriptBlob = function(e) {
                    return _.map(e.split("\n"), (function(e) {
                        return t.PlayerScriptEvent.fromLogLine(e)
                    }
                    ))
                }
                ,
                e
            }();
            t.ScriptedViewer = n;
            var o = function() {
                function n(t, n, o) {
                    if ("flowplayer" === o.toLowerCase())
                        this.playerStub = new i(n);
                    else if ("video" === o.toLowerCase())
                        this.playerStub = new a(n);
                    else {
                        if ("panoptoflowplayer" != o.toLowerCase())
                            throw "Unknown player stub " + o;
                        this.playerStub = new r(new e.Viewer.Players.FlowplayerMachine("primary" == t.toLowerCase(),n,{
                            resize: $.noop,
                            togglePlaying: $.noop
                        }))
                    }
                    this.playerName = t
                }
                return n.prototype.runEvent = function(e, n) {
                    switch (t.PlayerScriptEvent.toLogLine(e.source, n + (new Date).getTime(), e.playerName, e.type, e.value),
                    e.type) {
                    case t.ViewerEventType.Load:
                        this.playerStub.load(e.value);
                        break;
                    case t.ViewerEventType.Play:
                        this.playerStub.play();
                        break;
                    case t.ViewerEventType.Pause:
                        this.playerStub.pause();
                        break;
                    case t.ViewerEventType.Stop:
                        this.playerStub.stop();
                        break;
                    case t.ViewerEventType.Seek:
                        this.playerStub.seek(parseFloat(e.value) || 0);
                        break;
                    case t.ViewerEventType.Speed:
                        this.playerStub.speed(parseFloat(e.value) || 0);
                        break;
                    case t.ViewerEventType.Bitrate:
                        this.playerStub.bitrate(parseFloat(e.value) || 0);
                        break;
                    case t.ViewerEventType.Fullscreen:
                        this.playerStub.fullscreen("true" == e.value.toLowerCase());
                        break;
                    case t.ViewerEventType.Volume:
                        this.playerStub.volume(parseFloat(e.value));
                        break;
                    case t.ViewerEventType.Mute:
                        this.playerStub.mute("true" == e.value.toLowerCase())
                    }
                }
                ,
                n
            }()
              , i = function() {
                function e(e) {
                    this.$element = e,
                    this.ensureInitialized()
                }
                return e.prototype.load = function(t) {
                    var n = {
                        sources: [{
                            src: t,
                            type: -1 !== t.indexOf(".m3u8") ? e.HLSMimeType : e.MP4MimeType
                        }]
                    };
                    this.api ? this.api.load(n) : this.api = flowplayer(this.$element, {
                        clip: n
                    })
                }
                ,
                e.prototype.play = function() {
                    this.api.resume()
                }
                ,
                e.prototype.pause = function() {
                    this.api.pause()
                }
                ,
                e.prototype.stop = function() {
                    this.api.stop()
                }
                ,
                e.prototype.seek = function(e) {
                    this.api.seek(e || 0)
                }
                ,
                e.prototype.speed = function(e) {
                    this.api.speed(e)
                }
                ,
                e.prototype.bitrate = function(e) {}
                ,
                e.prototype.fullscreen = function(e) {
                    e != this.api.isFullscreen && this.api.fullscreen()
                }
                ,
                e.prototype.volume = function(e) {
                    this.api.volume(e / 100)
                }
                ,
                e.prototype.mute = function() {
                    this.api.mute(!0)
                }
                ,
                e.prototype.ensureInitialized = function() {
                    flowplayer.conf.hlsjs || (flowplayer.conf.hlsjs = {
                        startLevel: "auto",
                        safari: !0
                    })
                }
                ,
                e.MP4MimeType = "video/mp4",
                e.HLSMimeType = "application/x-mpegURL",
                e
            }()
              , a = function() {
                function e(e) {
                    this.video = $.parseHTML("<video />")[0],
                    e.append(this.video),
                    this.hls = new Hls,
                    this.hls.attachMedia(this.video)
                }
                return e.prototype.load = function(e) {
                    e.indexOf(".m3u8") ? this.hls.loadSource(e) : this.video.src = e
                }
                ,
                e.prototype.play = function() {
                    this.video.play()
                }
                ,
                e.prototype.pause = function() {
                    this.video.pause()
                }
                ,
                e.prototype.stop = function() {
                    this.hls.stopLoad()
                }
                ,
                e.prototype.seek = function(e) {
                    this.video.currentTime = e
                }
                ,
                e.prototype.speed = function(e) {
                    this.video.playbackRate = e
                }
                ,
                e.prototype.bitrate = function(e) {}
                ,
                e.prototype.fullscreen = function(e) {
                    e ? this.video.requestFullscreen() : this.video.stopFullscreen()
                }
                ,
                e.prototype.volume = function(e) {
                    this.video.volume = e / 100
                }
                ,
                e.prototype.mute = function() {
                    this.video.muted = !0
                }
                ,
                e
            }()
              , r = function() {
                function e(e) {
                    this.panoptoPlayer = e
                }
                return e.prototype.load = function(e) {
                    this.panoptoPlayer.content({
                        url: e,
                        isBroadcast: !1,
                        isAudioOnly: !1
                    })
                }
                ,
                e.prototype.play = function() {
                    this.panoptoPlayer.playState(1)
                }
                ,
                e.prototype.pause = function() {
                    this.panoptoPlayer.playState(2)
                }
                ,
                e.prototype.stop = function() {
                    this.panoptoPlayer.playState(3)
                }
                ,
                e.prototype.seek = function(e) {
                    this.panoptoPlayer.position(e)
                }
                ,
                e.prototype.speed = function(e) {
                    this.panoptoPlayer.playSpeed(e)
                }
                ,
                e.prototype.bitrate = function(e) {
                    this.panoptoPlayer.bitrate(e)
                }
                ,
                e.prototype.fullscreen = function(e) {
                    this.panoptoPlayer.isFullscreen(e)
                }
                ,
                e.prototype.volume = function(e) {
                    this.panoptoPlayer.volume(e)
                }
                ,
                e.prototype.mute = function(e) {
                    this.panoptoPlayer.muted(e)
                }
                ,
                e
            }()
        }(t.Test || (t.Test = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = PanoptoCore.Logging.Logger
              , n = function() {
                function t() {}
                return t.createLogger = function(n) {
                    if (!t.source) {
                        var a = Panopto.Core.StringHelpers.parseQueryString(window.location.search.slice(1), !1, !0);
                        t.source = a.scriptmode ? a.scriptmode.toString().toLowerCase() : e.ViewerEventSource.None
                    }
                    return t.source !== e.ViewerEventSource.None ? new o(t.source,n) : new i
                }
                ,
                t
            }();
            e.ViewerScriptLoggerFactory = n;
            var o = function() {
                function n(e, t) {
                    this.scriptMode = e,
                    this.playerName = t
                }
                return n.prototype.log = function(n, o, i) {
                    n !== this.scriptMode && (this.scriptMode != e.ViewerEventSource.LogInputAndOutput || n != e.ViewerEventSource.LogInput && n != e.ViewerEventSource.LogDefer && n != e.ViewerEventSource.LogOutput) || t.info(e.PlayerScriptEvent.toLogLine(n, (new Date).getTime(), this.playerName, o, i))
                }
                ,
                n
            }()
              , i = function() {
                function e() {}
                return e.prototype.log = function(e, t, n) {}
                ,
                e
            }()
        }(e.Test || (e.Test = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Controls = Panopto.Viewer.Controls || {},
Panopto.Viewer.Controls.Timeline = Panopto.Viewer.Controls.Timeline || {},
function(e) {
    !function(e) {
        !function(e) {
            !function(e) {
                var t = function(e, t, n) {
                    this.element = e,
                    this.start = t,
                    this.end = n,
                    this.start = t / Panopto.Core.Constants.TimelineChunkMultiplier,
                    this.end = n / Panopto.Core.Constants.TimelineChunkMultiplier
                };
                e.TimelineSegment = t
            }(e.Timeline || (e.Timeline = {}))
        }(e.Controls || (e.Controls = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
Panopto.Viewer.Controls.Timeline.TimelineConverter = function(e, t) {
    var n, o, i, a = function() {
        _.each(t.secondaryStreams, (function(e) {
            e.segments.length = 0,
            e.timeline.length = 0,
            _.each(o, (function(t) {
                var n = t.element.getStreamById(e.id);
                n && (e.segments.push({
                    relativeStart: t.start,
                    relativeEnd: t.end,
                    streamOffset: n.offset / Panopto.Core.Constants.TimelineChunkMultiplier,
                    timelineStart: t.start
                }),
                e.timeline.push(t.start, t.end))
            }
            ))
        }
        ))
    }, r = function() {
        var e;
        i.length ? e = i[i.length - 1].end : e = n.duration() / Panopto.Core.Constants.TimelineChunkMultiplier;
        return e
    };
    return {
        timelinePosition: function(e) {
            var t, n = e;
            return i && (_.some(i, (function(t) {
                return t.start <= e && t.end >= e
            }
            )) || (n = (t = _.find(i, (function(t) {
                return t.start > e
            }
            ))) ? t.start : r())),
            n
        },
        timelineEndPosition: r,
        computeSegments: function(t, r) {
            n = t;
            _.sortBy(n.streams(), "absoluteStart");
            var s, l, d = r ? n.createTimeline(!0) : n.timeline(), c = d.elements(), u = d.firstPrimaryIndex(), p = d.lastPrimaryIndex(), f = 0, h = n.firstPrimaryOffset() / Panopto.Core.Constants.TimelineChunkMultiplier;
            for (o = [],
            i = [],
            s = 0; s <= c.length - 1; s++)
                s >= u && s <= p && (l = new PanoptoTS.Viewer.Controls.Timeline.TimelineSegment(c[s],f,f + c[s].length()),
                o.push(l),
                c[s].containsPrimary() && i.push(l)),
                f += c[s].length();
            _.each(o, (function(e) {
                e.start -= h,
                e.end -= h
            }
            )),
            e.setPrimarySegments(o, i, n.duration() / Panopto.Core.Constants.TimelineChunkMultiplier, !r),
            a()
        },
        getSegments: function() {
            return o
        }
    }
}
;
__spreadArray = this && this.__spreadArray || function(e, t, n) {
    if (n || 2 === arguments.length)
        for (var o, i = 0, a = t.length; i < a; i++)
            !o && i in t || (o || (o = Array.prototype.slice.call(t, 0, i)),
            o[i] = t[i]);
    return e.concat(o || Array.prototype.slice.call(t))
}
;
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Controls = Panopto.Viewer.Controls || {},
Panopto.Viewer.Controls.Timeline = Panopto.Viewer.Controls.Timeline || {},
Panopto.Viewer.Controls.Timeline.TimelineEditor = function(e, t, n, o, i, a) {
    var r, s, l, d, c, u, p, f, h, m, v, y, P, g, S, C = PanoptoCore.Logging.Logger, w = {}, b = !0, T = [], E = !1, V = [], I = new Panopto.Core.JobQueue({
        maxDegreeOfParallelism: 1,
        maxAttempts: 1,
        autoStart: !0
    }), k = [], R = !0, D = new PanoptoTS.Core.Logic.Time.TimeConverter, L = Panopto.features.uploadApiEnabledForStreamUpload && Panopto.features.useUploadAPIForWebUpload, x = Panopto.features.uploadApiForceUseMachineS3Credentials || Panopto.features.uploadApiForceCloudContentStore || Panopto.isPanoptoHosted, O = new PanoptoTS.Viewer.Tabs.Editor.EventService(D);
    O.eventAdded.add((function(e) {
        fe(),
        p.events().push(e),
        p.refreshTimeline(),
        le()
    }
    ));
    var U, M = function(e) {
        _e(e.uploadId)
    }, A = function(e) {
        pe()
    }, H = new PanoptoCore.TypedCallback, B = $("#timelineContainer"), F = $("#playControls"), N = $("#saveMessageText"), z = $("#saveRetryLink"), G = $("#undoButton"), j = $("#redoButton"), Q = $("#commitButton"), q = $("#revertButton"), W = $("#closeButton"), K = $("#advancedEditorLink"), J = $("#toggleTimelineButton"), Y = $("#slideStackExpandedView"), X = $("#slideStackExpandedViewTriangle"), Z = Y.add(X), ee = o.availableLanguages && o.availableLanguages.length > 0 ? o.availableLanguages[0] : null, te = function(e) {
        var t = $.Deferred()
          , n = $.Deferred()
          , o = $.Deferred()
          , a = $.Deferred()
          , r = $.Deferred()
          , s = $.Deferred()
          , l = [n, o, a, r, s];
        return i.getAllStreams(e.referencedSessionId, (function(t) {
            e.streams = t,
            n.resolve()
        }
        ), (function() {
            n.reject()
        }
        )),
        Panopto.Core.ServiceInterface.Rest.Sessions.getAllCuts(e.referencedSessionId, (function(t) {
            e.cuts = t,
            o.resolve()
        }
        ), (function() {
            o.reject()
        }
        )),
        Panopto.Core.ServiceInterface.Rest.Sessions.getAllEvents(e.referencedSessionId, {
            eventTypes: [Panopto.Core.EventType.Label, Panopto.Core.EventType.SmartOcrToc],
            pageSize: Panopto.viewer.timelineEditorEventsPageSize
        }, (function(t) {
            e.events = t,
            a.resolve()
        }
        ), (function() {
            a.reject()
        }
        )),
        Panopto.Core.ServiceInterface.Rest.Sessions.getAllSlideEvents(e.referencedSessionId, {
            pageSize: Panopto.viewer.timelineEditorEventsPageSize
        }, (function(t) {
            e.slideEvents = _.filter(t, (function(e) {
                return e.timelineTime
            }
            )),
            r.resolve()
        }
        ), (function() {
            r.reject()
        }
        )),
        Panopto.Core.ServiceInterface.Rest.Sessions.getAllCaptions(e.referencedSessionId, {
            pageSize: Panopto.viewer.timelineEditorEventsPageSize,
            Language: ee
        }, (function(t) {
            e.captions = t,
            s.resolve()
        }
        ), (function() {
            s.reject()
        }
        )),
        $.when.apply($, l).then((function() {
            var n = [].concat(e.events).concat(e.slideEvents).concat(e.captions);
            e.timelineState = new PanoptoTS.Core.UI.Components.Editor.TimelineState(e.streams,e.cuts,n,void 0,void 0,void 0,void 0,!1),
            _.chain(e.cuts).each((function(t) {
                var o = t.start / Panopto.Core.Constants.TimelineChunkMultiplier
                  , i = (t.start + t.duration) / Panopto.Core.Constants.TimelineChunkMultiplier;
                if (t.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream) {
                    var a = (_.find(e.timelineState.streams(), (function(e) {
                        return e.id === t.targetId
                    }
                    )).absoluteStart - e.timelineState.absoluteStart()) / Panopto.Core.Constants.TimelineChunkMultiplier;
                    o += a,
                    i += a
                }
                _.each(__spreadArray([], n, !0), (function(e) {
                    (t.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session || e.streamId === t.targetId) && e.editorTime >= o && e.editorTime < i && (e.editorTime = -1,
                    n.splice(_.findIndex(n, (function(t) {
                        return t.id === e.id
                    }
                    )), 1))
                }
                ))
            }
            )),
            e.events = _.filter(e.events, (function(e) {
                return -1 !== e.editorTime
            }
            )),
            e.slideEvents = _.filter(e.slideEvents, (function(e) {
                return -1 !== e.editorTime
            }
            )),
            e.captions = _.filter(e.captions, (function(e) {
                return -1 !== e.editorTime
            }
            )),
            _.chain(e.cuts).sortBy((function(e) {
                return -e.start
            }
            )).each((function(e) {
                if (e.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session) {
                    var t = e.start / Panopto.Core.Constants.TimelineChunkMultiplier
                      , o = e.duration / Panopto.Core.Constants.TimelineChunkMultiplier;
                    _.each(n, (function(e) {
                        e.editorTime >= t && (e.editorTime = e.editorTime - o)
                    }
                    ))
                }
            }
            )),
            t.resolve(e)
        }
        )).fail((function() {
            t.reject()
        }
        )),
        t
    }, ne = function(e, t, n) {
        var o = $.Deferred();
        return i.getOne(e, (function(e) {
            var i = new PanoptoTS.Core.ServiceInterface.Rest.Objects.SessionReference({
                id: _.uniqueId("newSessionReference"),
                referencedSessionId: e.id,
                referencedSessionDuration: e.duration,
                start: t,
                order: n,
                name: e.name,
                typeName: "SessionReference"
            });
            te(i).done((function(e) {
                o.resolve(e)
            }
            ))
        }
        )),
        o.promise()
    }, oe = function(e) {
        return _.find(p.streams(), (function(t) {
            return t.id === e
        }
        ))
    }, ie = function(e) {
        var t;
        switch (e.type) {
        case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Audio:
            t = Panopto.GlobalResources.ViewerPlus_AudioTitle;
            break;
        case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Screen:
        case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Slide:
            t = Panopto.GlobalResources.ViewerPlus_ScreenCaptureTitle;
            break;
        case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Camera:
        default:
            t = Panopto.GlobalResources.ViewerPlus_ObjectVideoTitle
        }
        return t
    }, ae = function(e, t, n, o) {
        var i = (e = e || oe(t)).name;
        return i || (i = ie(e)),
        n ? o ? Panopto.GlobalResources.ViewerPlus_Edit_StreamNameAndType.format(i, e.isPrimary ? Panopto.GlobalResources.ViewerPlus_Edit_Primary.toLowerCase() + " " + o : Panopto.GlobalResources.ViewerPlus_Edit_Secondary.toLowerCase() + " " + o) : Panopto.GlobalResources.ViewerPlus_Edit_StreamNameAndType.format(i, e.isPrimary ? Panopto.GlobalResources.ViewerPlus_Edit_Primary.toLowerCase() : Panopto.GlobalResources.ViewerPlus_Edit_Secondary.toLowerCase()) : i
    }, re = function() {
        D.applyState(p),
        O.applyState(r.id, p),
        Me.applyState(p),
        y.events(p.streams()),
        l.cuts(p.cuts()),
        v.events(p.cuts()),
        P && P.events(p.questionLists()),
        p.events().sort((function(e, t) {
            return e.timelineTime - t.timelineTime || e.id.localeCompare(t.id)
        }
        )),
        _.each(V, (function(e) {
            e.events(p.events())
        }
        )),
        g.thumbnails(p.events())
    }, se = function(e) {
        var n, i, a, r;
        d.computeSegments(p, b),
        pe(),
        e || (g.toggle(!R),
        t.resize(),
        n = _.filter(p.getExpandedEvents(), (function(e) {
            return !e.isDefaultThumbnail
        }
        )),
        i = _.filter(n, (function(e) {
            return e.link
        }
        )),
        a = _.filter(n, (function(e) {
            return e.type === Panopto.Core.EventType.SlideChange
        }
        )),
        r = _.filter(n, (function(e) {
            return e.type === Panopto.Core.EventType.Caption
        }
        )),
        o.documents.length = 0,
        _.each(p.questionLists(), (function(e) {
            var t = D.toUneditedFirstPrimaryRelative(e.firstStreamRelativeTicks).seconds();
            o.documents.push({
                title: e.name,
                id: "urlTab" + e.id,
                timeline: [t, t + PanoptoViewer.Constants.UrlEventDuration],
                url: PanoptoTS.Viewer.Constants.QuizEditUrlTemplate.format(e.id),
                iconCode: Panopto.Core.Constants.QuestionListIconCode,
                pauseWhenAvailable: !0,
                hiddenTab: !0
            })
        }
        )),
        _.each(i, (function(e) {
            var t = -1 !== e.link.indexOf(PanoptoViewer.Constants.YouTubeEmbedBaseUrl)
              , n = t && e.sessionId === o.id ? PanoptoTS.Viewer.Constants.YouTubeEditUrlTemplate.format(e.id) : e.link;
            o.documents.push({
                title: e.name || Panopto.GlobalResources.ViewerPlus_Website,
                id: "urlTab" + e.id,
                timeline: [e.viewerTime, e.viewerTime + PanoptoViewer.Constants.UrlEventDuration],
                url: n,
                pauseWhenAvailable: !0,
                iconClass: t ? PanoptoTS.Viewer.Constants.YouTubeIconClass : void 0,
                iconCode: t ? void 0 : Panopto.Core.Constants.LinkIconCode
            })
        }
        )),
        o.documents.sort((function(e, t) {
            return e.timeline[0] - t.timeline[0]
        }
        )),
        o.slideDecks.length = 0,
        a.length && o.slideDecks.push({
            title: Panopto.GlobalResources.ViewerPlus_SlidesTitle,
            id: PanoptoTS.Viewer.Constants.SlideDeckId,
            timeline: [0],
            slides: _.map(a, (function(e) {
                return {
                    time: e.viewerTime,
                    url: e.slideUrl
                }
            }
            )),
            iconCode: Panopto.Core.Constants.SlideIconCode,
            tabClass: PanoptoTS.Viewer.Constants.SlideDeckTabClass
        }),
        o.hasCaptions = !!r.length,
        r.length && (o.captions = [],
        _.each(r, (function(e) {
            o.captions.push({
                time: e.viewerTime,
                text: _.escape(e.name)
            })
        }
        ))),
        _.each(p.sessionReferences, (function(e) {
            _.chain(e.streams).filter((function(e) {
                return !e.isPrimary
            }
            )).each((function(e) {
                var t = []
                  , n = [];
                _.each(d.getSegments(), (function(o) {
                    var i = o.element.getStreamById(e.id);
                    i && (t.push({
                        relativeStart: o.start,
                        relativeEnd: o.end,
                        streamOffset: i.offset / Panopto.Core.Constants.TimelineChunkMultiplier,
                        timelineStart: o.start
                    }),
                    n.push(o.start, o.end))
                }
                ));
                var i = {
                    title: ae(e, void 0),
                    id: e.id,
                    tabClass: e.type === Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Audio || e.type === Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Screen ? PanoptoTS.Viewer.Constants.ScreenCaptureClass : PanoptoTS.Viewer.Constants.ObjectVideoTabClass,
                    iconClass: void 0,
                    iconCode: void 0,
                    timeline: n,
                    relativeStartTime: void 0,
                    absoluteStartTime: e.absoluteStart,
                    hiddenTab: !1,
                    pauseWhenAvailable: !1,
                    isSessionPlaybackBlocking: !1,
                    isBroadcast: !1,
                    isSecondaryPaneOnly: !1,
                    interrupted: !1,
                    isAudioOnly: !1,
                    optimizationToken: void 0,
                    url: e.url,
                    mediaFileType: e.mediaFileType,
                    type: e.type,
                    relativeStart: void 0,
                    relativeEnd: void 0,
                    length: void 0,
                    segments: t,
                    vrType: e.vrType
                }
                  , a = _.findIndex(o.secondaryStreams, (function(t) {
                    return t.id === e.id
                }
                ));
                a > -1 ? o.secondaryStreams.splice(a, 1, i) : o.secondaryStreams.push(i)
            }
            ))
        }
        )),
        _.each(o.primaryStreams.concat(o.secondaryStreams), (function(e) {
            e.title = void 0 !== e.title ? e.title : ae(void 0, e.id),
            e.vrType = void 0 !== e.vrType ? e.vrType : oe(e.id).vrType
        }
        )),
        t.refreshPlayers()),
        t.synchronize(!e),
        V.forEach((function(e) {
            e.refreshSmartChapters && e.refreshSmartChapters()
        }
        ))
    }, le = function(e) {
        re(),
        e ? c.applyStateWhenChangeIsTimelineViewTriggered(p) : c.applyState(p),
        se(e),
        Pe()
    }, de = function() {
        re(),
        c.applyState(p),
        se()
    }, ce = function() {
        var e = T.indexOf(p);
        if (e) {
            var n = t.getPosition()
              , o = D.toWin32EpochRelative(n);
            p = T[e - 1],
            V.forEach((function(e) {
                e.refreshSmartChapters && e.refreshSmartChapters()
            }
            )),
            p.refreshTimeline(),
            le(),
            t.setPosition(p.calculateEditorTimeFromAbsolute(o.ticks()))
        }
    }, ue = function() {
        var e = T.indexOf(p);
        if (e < T.length - 1) {
            var n = t.getPosition()
              , o = D.toWin32EpochRelative(n);
            p = T[e + 1],
            V.forEach((function(e) {
                e.refreshSmartChapters && e.refreshSmartChapters()
            }
            )),
            p.refreshTimeline(),
            le(),
            t.setPosition(p.calculateEditorTimeFromAbsolute(o.ticks()))
        }
    }, pe = function() {
        var e = T.indexOf(p);
        G.toggleClass(Panopto.Core.Constants.DisabledClass, !e),
        j.toggleClass(Panopto.Core.Constants.DisabledClass, e === T.length - 1);
        var t = p !== u && s.id;
        q.toggleClass(Panopto.Core.Constants.DisabledClass, !t);
        var n = window.streamUploader && window.streamUploader.hasActiveUploads();
        Q.toggleClass(Panopto.Core.Constants.DisabledClass, !t || n),
        Q.attr("title", n ? Panopto.GlobalResources.ViewerPlus_Edit_ApplyBlockedByNewStreams : Panopto.GlobalResources.ViewerPlus_Edit_ApplyButtonTooltip)
    }, fe = function() {
        var e = T.indexOf(p)
          , t = p.copy();
        T.splice(e + 1, T.length - 1 - e, t),
        p = t,
        re()
    }, he = function(e) {
        return _.each(e, (function(e) {
            e.sessionId = o.id
        }
        )),
        _.filter(e, (function(e) {
            return e.timelineTime
        }
        ))
    }, me = function(e) {
        E = !0,
        clearTimeout(U),
        N.show(),
        N.text(e),
        N.removeClass(Panopto.Core.Constants.ErrorClass),
        Q.add(q).toggleClass(Panopto.Core.Constants.DisabledClass, !0),
        z.hide()
    }, ve = function(e, t, n) {
        E = !1,
        pe(),
        t ? (N.text(e.format(Panopto.Core.TimeHelpers.utcDateToFormattedString(Panopto.Core.TimeHelpers.toLocalPanoptoTime(Date.now(), Panopto.timeZone), "LT"))),
        U = setTimeout((function() {
            N.fadeOut()
        }
        ), 2e4)) : (N.text(e),
        N.addClass(Panopto.Core.Constants.ErrorClass),
        z.toggle(!!n),
        Panopto.Core.UI.Handlers.button(z, n))
    }, ye = function(e) {
        "SessionChangeSet Update can't change the owner of the change set" !== e.responseJSON && "Object not found" !== e.responseJSON && "Session already has an uncommitted change set." !== e.responseJSON || (s.id = void 0,
        G.add(j).add(Q).add(q).toggleClass("disabled", !0),
        t.toggleMessage(Panopto.GlobalResources.ViewerPlus_Edit_ChangesLost))
    }, Pe = function() {
        I.hasQueuedJobs() || I.queueJob({
            attempt: function(e) {
                var t = function() {
                    ve(Panopto.GlobalResources.ViewerPlus_Edit_SavedAt, !0),
                    e(!0)
                }
                  , n = function(t) {
                    ve(Panopto.GlobalResources.ViewerPlus_Edit_SaveFailure, !1, Pe),
                    ye(t),
                    e(!1)
                };
                p === u ? Panopto.Core.ServiceInterface.Rest.SessionChangeSets.deleteChangeSet(s.id, (function() {
                    s = Panopto.Core.ServiceInterface.Rest.Objects.SessionChangeSet({
                        sessionId: o.id
                    }),
                    t()
                }
                ), n) : (!function() {
                    var e = _.object(_.map(f, (function(e) {
                        return e.id
                    }
                    )), f)
                      , t = _.object(_.map(p.events(), (function(e) {
                        return e.id
                    }
                    )), p.events())
                      , n = _.object(_.map(h, (function(e) {
                        return e.id
                    }
                    )), h)
                      , o = _.object(_.map(p.questionLists(), (function(e) {
                        return e.id
                    }
                    )), p.questionLists())
                      , i = _.object(_.map(m, (function(e) {
                        return e.id
                    }
                    )), m)
                      , a = _.object(_.map(p.sessionReferences, (function(e) {
                        return e.id
                    }
                    )), p.sessionReferences);
                    s.cutsToReplace = _.map(p.cuts(), (function(e) {
                        return e.copy()
                    }
                    )),
                    s.streamsToUpdate = p.streams(),
                    s.slideDecksToDelete = p.slideDecksToDelete(),
                    s.eventsToAdd = _.filter(p.events(), (function(t) {
                        return !e[t.id]
                    }
                    )),
                    s.eventsToUpdate = _.filter(p.events(), (function(t) {
                        return e[t.id] && t.edited
                    }
                    )),
                    s.eventsToDelete = _.filter(f, (function(e) {
                        return !t[e.id]
                    }
                    )),
                    s.questionListRevisions = _.chain(p.questionLists()).filter((function(e) {
                        return !n[e.id] || e.isEdited
                    }
                    )).map((function(e) {
                        return e.toClientModel()
                    }
                    )).value(),
                    s.questionListIdsToDelete = _.map(_.filter(h, (function(e) {
                        return !o[e.id]
                    }
                    )), (function(e) {
                        return e.id
                    }
                    )),
                    s.sessionReferences.toAdd = _.chain(p.sessionReferences).filter((function(e) {
                        return !i[e.id]
                    }
                    )).map((function(e) {
                        var t = new AutoClientModels.SessionReferenceCreate;
                        return t.referencedSessionId = e.referencedSessionId,
                        t.order = e.order,
                        t.start = e.start,
                        t.cuts = [],
                        _.chain(p.cuts()).filter((function(t) {
                            return t.targetId === e.id
                        }
                        )).each((function(e) {
                            var n = new AutoClientModels.SessionReferenceCreateCut;
                            n.start = e.start / Panopto.Core.Constants.TimelineChunkMultiplier,
                            n.duration = e.duration / Panopto.Core.Constants.TimelineChunkMultiplier,
                            t.cuts.push(n)
                        }
                        )),
                        s.cutsToReplace = _.reject(s.cutsToReplace, (function(t) {
                            return t.targetId === e.id
                        }
                        )),
                        t
                    }
                    )).value(),
                    s.sessionReferences.toUpdate = _.chain(p.sessionReferences).filter((function(e) {
                        return i[e.id] && e.edited
                    }
                    )).map((function(e) {
                        var t = new AutoClientModels.SessionReferenceUpdate;
                        return t.id = e.id,
                        t.order = e.order,
                        t.start = e.start,
                        t
                    }
                    )).value(),
                    s.sessionReferences.toDelete = _.chain(m).filter((function(e) {
                        return !a[e.id]
                    }
                    )).map((function(e) {
                        return e.id
                    }
                    )).value(),
                    p.addedStreams.length && (s.streamChanges = new AutoClientModels.StreamChanges,
                    s.streamChanges.toAdd = _.map(p.addedStreams, (function(e) {
                        var t = new AutoClientModels.StreamCreate;
                        return t.copyFromStreamCreate(e),
                        t
                    }
                    )));
                    var r = u.streams().filter((function(e) {
                        return !p.streams().some((function(t) {
                            return t.id === e.id
                        }
                        ))
                    }
                    ));
                    r.length && (s.streamChanges || (s.streamChanges = new AutoClientModels.StreamChanges),
                    s.streamChanges.toDelete = r.map((function(e) {
                        var t = new AutoClientModels.StreamDelete;
                        return t.streamId = e.id,
                        t
                    }
                    ))),
                    s.normalizeVolume = p.getNormalizeVolume()
                }(),
                me(Panopto.GlobalResources.ViewerPlus_Edit_Saving),
                Panopto.Core.ServiceInterface.Rest.SessionChangeSets.save(s, (function(e) {
                    s.id = e.id,
                    t()
                }
                ), n))
            }
        })
    }, ge = function() {
        I.queueJob({
            attempt: function(e) {
                p !== u && s.id && (me(Panopto.GlobalResources.ViewerPlus_Edit_Applying),
                Panopto.Core.ServiceInterface.Rest.SessionChangeSets.commitChanges(s, (function() {
                    ve(Panopto.GlobalResources.ViewerPlus_Edit_ApplySuccess, !0),
                    s.id = void 0,
                    e(!0),
                    confirm(Panopto.GlobalResources.ViewerPlus_Edit_ContinueEditing) ? W.click() : window.location.reload()
                }
                ), (function(t) {
                    ve(Panopto.GlobalResources.ViewerPlus_Edit_ApplyFailure, !1, ge),
                    ye(t),
                    e(!1)
                }
                )))
            }
        })
    }, Se = function() {
        confirm(Panopto.GlobalResources.ViewerPlus_Edit_ConfirmRevert) && (I.emptyQueue(),
        I.queueJob({
            attempt: function(e) {
                p !== u && s.id && (me(Panopto.GlobalResources.ViewerPlus_Edit_Reverting),
                Panopto.Core.ServiceInterface.Rest.SessionChangeSets.deleteChangeSet(s.id, (function() {
                    ve(Panopto.GlobalResources.ViewerPlus_Edit_RevertedAt, !0),
                    s = Panopto.Core.ServiceInterface.Rest.Objects.SessionChangeSet({
                        sessionId: o.id
                    });
                    var n = t.getPosition()
                      , i = D.toWin32EpochRelative(n);
                    T.length = 0,
                    p = u,
                    V.forEach((function(e) {
                        e.refreshSmartChapters && e.refreshSmartChapters()
                    }
                    )),
                    p.refreshTimeline(),
                    T.push(p),
                    de(),
                    t.setPosition(p.calculateEditorTimeFromAbsolute(i.ticks())),
                    e(!0)
                }
                ), (function(t) {
                    ve(Panopto.GlobalResources.ViewerPlus_Edit_RevertFailure, !1, Se),
                    ye(t),
                    e(!1)
                }
                )))
            }
        }))
    }, Ce = function() {
        var e = _.chain(p.streams()).sortBy((function(e) {
            return e.absoluteStart
        }
        )).filter((function(e) {
            return e.isPrimary
        }
        )).value()
          , t = _.pluck(e, "id")
          , n = _.filter(p.cuts(), (function(e) {
            return e.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream && _.contains(t, e.targetId)
        }
        ))
          , o = Panopto.Core.Logic.Timeline.Timeline(e, n);
        _.each(o.elements(), (function(e) {
            var t, n = e.streams();
            if (n.length > 1)
                for (t = 1; t < n.length; t++)
                    l.addCut(n[t].offset, n[t].offset + e.length(), n[t].stream.id, Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream, !1)
        }
        ))
    }, we = function(e, t, n, i, a) {
        var r;
        t <= e ? C.error("Could not create cut. Operation will create a negative cut. relativeStart: " + e + " relativeEnd: " + t) : (l.addCut(e, t, n || o.id, i, a),
        r = Panopto.Core.Logic.Timeline.Timeline(p.streams(), p.cuts()),
        i !== Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session || _.some(r.elements(), (function(e) {
            return e.containsPrimary()
        }
        )) || (l.removeAll(o.id, Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session),
        c.applyState(p),
        alert(Panopto.GlobalResources.ViewerPlus_Edit_CutEntireSession)))
    }, be = function(e, t, n) {
        var i;
        switch (n) {
        case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session:
            t = o.id,
            i = p.calculateRelativeTimeForCut(e, t);
            break;
        case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream:
            i = p.calculateRelativeTimeForCut(e, t);
            break;
        case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.SessionReference:
            i = e
        }
        l.removeCut(i, t, n)
    }, Te = function(e, t, n, o, i) {
        n <= t ? C.error("Could not create cut. Operation will create a negative cut. relativeStart: " + t + " relativeEnd: " + n) : (be(e, o, i),
        we(t, n, o, i, !1))
    }, Ee = function() {
        var e = new AutoClientModels.QuestionOption;
        e.id = _.uniqueId("questionOption"),
        e.name = Panopto.GlobalResources.ViewerPlus_Edit_QuestionList_DefaultOption1,
        e.isCorrect = !0;
        var t = new AutoClientModels.QuestionOption;
        t.id = _.uniqueId("questionOption"),
        t.name = Panopto.GlobalResources.ViewerPlus_Edit_QuestionList_DefaultOption2,
        t.isCorrect = !1;
        var n = new AutoClientModels.Question;
        return n.id = _.uniqueId("question"),
        n.name = Panopto.GlobalResources.ViewerPlus_Edit_QuestionList_DefaultQuestionName,
        n.questionType = AutoRestModels.QuestionType.MultipleChoice,
        n.options = [e, t],
        n
    }, Ve = function(e) {
        var n, o = t.position(), i = !0;
        if (p.isTimeInSessionReference(o)) {
            var a = p.findNextTimeNotInSessionReference(o);
            if (a >= p.duration())
                alert(Panopto.GlobalResources.ViewerPlus_EventTab_EventDuringClipAtEnd),
                i = !1;
            else
                confirm(Panopto.GlobalResources.ViewerPlus_EventTab_EventDuringClip) ? n = a : i = !1
        } else
            n = o * Panopto.Core.Constants.TimelineChunkMultiplier;
        var s = Math.floor(p.duration() / Panopto.Core.Constants.TimelineChunkToMillisMultiplier) * Panopto.Core.Constants.TimelineChunkToMillisMultiplier;
        if (s <= n && (n = s),
        i) {
            fe();
            var l = t.getPosition()
              , d = new PanoptoTS.Models.Editor.EditableQuestionList;
            d.id = _.uniqueId("questionList"),
            d.name = e || Panopto.GlobalResources.ViewerPlus_Edit_QuestionList_DefaultName,
            d.sessionId = r.id,
            d.firstStreamRelativeTicks = D.toFirstStreamRelative(l),
            d.isEdited = !0,
            d.isSessionPlaybackBlocking = !0,
            d.allowRetake = !0,
            d.showFinalGrade = !0,
            d.allowReview = !0,
            d.questions = [Ee()],
            p.questionLists().push(d),
            p.refreshTimeline(),
            le(!1)
        }
    }, _e = function(e) {
        fe();
        var t = new AutoClientModels.StreamCreate;
        t.uploadId = e,
        p.addedStreams.push(t),
        le()
    }, Ie = function(e) {
        var n = t.getPosition()
          , o = D.toWin32EpochRelative(n);
        fe();
        var i = _.find(p.events(), (function(e) {
            return e.isDefaultThumbnail
        }
        ));
        i && p.events().splice(p.events().indexOf(i), 1);
        var a = e ? t.activePrimary() : t.activeSecondary()
          , s = Panopto.Core.ServiceInterface.Rest.Objects.Event({
            sessionId: r.id,
            timelineTime: o.ticks(),
            isDefaultThumbnail: !0
        });
        if (_.find(p.streams(), (function(e) {
            return e.id === a.id
        }
        )))
            s.type = Panopto.Core.EventType.Label,
            s.streamId = a.id;
        else if (a.id === PanoptoTS.Viewer.Constants.SlideDeckId) {
            s.type = Panopto.Core.EventType.SlideChange;
            var l = _.filter(p.events(), (function(e) {
                return e.type === Panopto.Core.EventType.SlideChange
            }
            ));
            l = _.sortBy(l, "timelineTime"),
            s.slideId = l[0].slideId,
            _.find(l, (function(e) {
                if (!(e.timelineTime <= o.ticks()))
                    return !0;
                s.slideId = e.slideId
            }
            ))
        }
        p.events().push(s),
        le()
    }, ke = function(e) {
        var t = _.find(p.events(), (function(t) {
            return t.id === e
        }
        ));
        return t.sessionRelativeTime = p.calculateEditorTimeTicksFromAbsolute(t.timelineTime),
        t
    }, Re = function(n, s, m, v, P, S, I, U) {
        var H = _.min(_.filter(n, (function(e) {
            return e.isPrimary
        }
        )), (function(e) {
            return e.absoluteStart
        }
        ))
          , N = function(e, t) {
            var n, o;
            switch (e.targetType) {
            case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session:
            case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream:
                n = p.calculateRelativeTimeFromRelativeEditorTime(e.relativeEditorStart, e.targetId),
                o = p.calculateRelativeTimeFromRelativeEditorTime(e.relativeEditorEnd, e.targetId);
                break;
            case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.SessionReference:
                n = e.relativeEditorStart,
                o = e.relativeEditorEnd
            }
            o <= n ? C.error("Could not create cut from CutView. Operation will create a negative cut. relativeStart: " + n + " relativeEnd: " + o + " cutView:", e) : we(n, o, e.targetId, e.targetType, t)
        }
          , z = function(e) {
            var t = p.calculateEditorTimeFromRelativeEditorTime(e.relativeEditorStart, e.targetId);
            be(t, e.targetId, e.targetType)
        };
        _.each(o.primaryStreams.concat(o.secondaryStreams), (function(e) {
            var t = _.find(n, (function(t) {
                return t.id === e.id
            }
            ));
            t && (e.length = t.duration / Panopto.Core.Constants.TimelineChunkMultiplier,
            e.url = t.url)
        }
        )),
        v = he(v).concat(he(P)).concat(he(S)),
        function(e) {
            _.each(e, (function(e) {
                e.sessionId = o.id
            }
            ))
        }(I),
        f = v,
        v = _.map(v, (function(e) {
            return e.copy()
        }
        )),
        h = I;
        var ee = _.map(I, (function(e) {
            var t = new PanoptoTS.Models.Editor.EditableQuestionList;
            return t.copyFromClientModel(e),
            t
        }
        ));
        if (function(e, t, n, o) {
            var i = Panopto.Core.Logic.Timeline.Timeline(t)
              , a = []
              , r = e.absoluteStart;
            t.forEach((function(e) {
                r = Math.min(r, e.absoluteStart)
            }
            )),
            _.each(i.elements(), (function(e) {
                e.streams().length || a.push({
                    start: r,
                    end: r + e.length(),
                    length: e.length()
                }),
                r += e.length()
            }
            )),
            a.reverse(),
            _.each(a, (function(i) {
                var a = [];
                _.each(t, (function(e) {
                    e.absoluteStart >= i.end && (e.absoluteStart -= i.length)
                }
                )),
                _.each(n, (function(t) {
                    t.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session && t.start + e.absoluteStart >= i.end && (t.start -= i.length)
                }
                )),
                _.each(o, (function(e) {
                    var t;
                    e.timelineTime > i.start && e.timelineTime < i.end && e.type === Panopto.Core.EventType.SlideChange ? (t = _.find(o, (function(t) {
                        return t.type === Panopto.Core.EventType.SlideChange && t.timelineTime > e.timelineTime
                    }
                    ))) && t.timelineTime <= i.end ? a.push(e) : (e.timelineTime = i.start,
                    e.edited = !0) : e.timelineTime >= i.end && (e.timelineTime -= i.length,
                    e.edited = !0)
                }
                )),
                _.each(a, (function(e) {
                    o.splice(o.indexOf(e), 1)
                }
                ))
            }
            ))
        }(H, n, s, v),
        _.some(n, (function(e) {
            return e.isPrimary
        }
        )) ? (F.show(),
        B.show()) : (F.hide(),
        B.hide()),
        l = Panopto.Core.Logic.Timeline.CutEditor(s),
        d = Panopto.Viewer.Controls.Timeline.TimelineConverter(t, o),
        c = Panopto.Core.UI.Components.Editor.TimelineView(o.id, o.folder.id, {
            positionChanged: function(e) {
                t.setPosition(e / Panopto.Core.Constants.TimelineChunkMultiplier)
            },
            cutAdded: function(e, t) {
                fe(),
                N(e, t),
                le(!0)
            },
            cutRemoved: function(e) {
                fe(),
                z(e),
                le(!0)
            },
            cutResized: function(e, t) {
                var n, o;
                switch (t.targetType) {
                case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session:
                case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream:
                    n = p.calculateRelativeTimeFromRelativeEditorTime(t.relativeEditorStart, t.targetId),
                    o = p.calculateRelativeTimeFromRelativeEditorTime(t.relativeEditorEnd, t.targetId);
                    break;
                case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.SessionReference:
                    n = t.relativeEditorStart,
                    o = t.relativeEditorEnd
                }
                o <= n ? C.error("Could not create cut from CutView. Operation will create a negative cut. relativeStart: " + n + " relativeEnd: " + o + " cutView:", t) : (fe(),
                Te(e, n, o, t.targetId, t.targetType),
                le(!0))
            },
            focusAdded: function(e, t) {
                fe(),
                _.each(e, z),
                _.each(t, (function(e) {
                    N(e, !1)
                }
                )),
                le(!0)
            },
            previewChanged: function(e) {
                b = e,
                se()
            },
            thumbnailChosen: Ie,
            uploadChosen: function() {
                t.toggleScreens(!1),
                Panopto.Application.defaultInstance.updateState({
                    modalPage: "SessionInfo",
                    modalHeader: Panopto.Core.TextHelpers.innerText(r.name),
                    modalParams: Panopto.Core.StringHelpers.serializeObjectToQueryString({
                        id: r.id
                    })
                })
            },
            stackExpanded: function(e, n) {
                var o, i, a;
                e.length === k.length && _.every(k, (function(t) {
                    return _.any(e, (function(e) {
                        return t.id === e.id
                    }
                    ))
                }
                )) ? (Z.hide(),
                k = []) : (k = e,
                o = Panopto.Viewer.Controls.ThumbnailStrip(Y, e, t, w, !0),
                i = n.offset().left + n.outerWidth() / 2,
                a = n.offset().top - 10,
                Y.empty(),
                o.render((function() {
                    Y.show().toggleClass("no-scroll", Y[0].scrollWidth === Y.innerWidth()).css({
                        left: Math.clamp(i - Y.outerWidth() / 2, 0, $(window).width() - Y.outerWidth()),
                        top: a - Y.outerHeight()
                    }),
                    X.show().css({
                        left: i,
                        top: a
                    }),
                    $(document).on("mousedown.expanded-view", (function(e) {
                        Y.is(e.target) || X.is(e.target) || 0 !== Y.find(e.target).length || (Z.hide(),
                        $(document).off("mousedown.expanded-view"))
                    }
                    ))
                }
                )))
            },
            sessionReferenceAdded: function(e) {
                var n = p.calculateRelativeTime(t.position() * Panopto.Core.Constants.TimelineChunkMultiplier);
                n > p.hostDuration() - .1 * Panopto.Core.Constants.TimelineChunkMultiplier && (n = p.hostDuration());
                var o = _.chain(p.sessionReferences).filter((function(e) {
                    return e.start === n
                }
                )).size().value();
                ne(e, n, o).done((function(e) {
                    var n = t.position();
                    fe(),
                    p.sessionReferences.push(e),
                    p.refreshTimeline(),
                    le(),
                    t.setPosition(n)
                }
                ))
            },
            sessionReferenceEdited: function(e, t) {
                V.forEach((function(n) {
                    n.handleSessionReferenceEdit && n.handleSessionReferenceEdit(e, t)
                }
                ))
            },
            sessionReferenceHovered: function(e, t) {
                V.forEach((function(n) {
                    n.handleSessionReferenceHighlight && n.handleSessionReferenceHighlight(e, t)
                }
                ))
            },
            streamAddClicked: function() {
                y.showUploadOverlay(void 0)
            },
            questionListAddClicked: function() {
                Ve("")
            },
            youTubeAddClicked: function() {
                O.addYouTubeEvent("", t.position())
            },
            webpageAddClicked: function() {
                O.addUrlEvent("", t.position())
            },
            timelineExpansionToggled: function(e) {
                t.expandTimeline(e)
            },
            addContentExpansionControlToggled: function(e) {
                t.toggleScreens(!e)
            },
            normalizeVolumeChanged: function(e) {
                fe(),
                p.setNormalizeVolume(e),
                le(!0)
            }
        }, {
            previewCuts: Panopto.GlobalResources.ViewerPlus_Edit_PreviewCuts,
            normalizeVolumeLabel: Panopto.GlobalResources.ViewerPlus_Edit_NormalizeVolume_Label,
            normalizeVolumeTooltip: Panopto.GlobalResources.ViewerPlus_Edit_NormalizeVolume_Tooltip,
            timeSeparator: Panopto.GlobalResources.TimeSeparator,
            millisecondPrecision: Panopto.Core.Constants.DisplayTimeMillisecondPrecision,
            ViewerPlus_Edit_Expand: Panopto.GlobalResources.ViewerPlus_Edit_Expand,
            ViewerPlus_Edit_Collapse: Panopto.GlobalResources.ViewerPlus_Edit_Collapse,
            cutTool: Panopto.GlobalResources.ViewerPlus_Edit_Tools_Cut,
            quizTool: Panopto.GlobalResources.ViewerPlus_Edit_Tools_Quiz,
            focusTool: Panopto.GlobalResources.ViewerPlus_Edit_Tools_Focus,
            addContentButton: Panopto.GlobalResources.ViewerPlus_Edit_AddContent,
            thumbnailButton: Panopto.GlobalResources.ViewerPlus_Edit_SetDefaultThumbnail,
            setPrimaryAsDefaultThumbnail: Panopto.GlobalResources.ViewerPlus_Edit_SetPrimaryAsDefaultThumbnail,
            setSecondaryAsDefaultThumbnail: Panopto.GlobalResources.ViewerPlus_Edit_SetSecondaryAsDefaultThumbnail,
            uploadCustomDefaultThumbnail: Panopto.GlobalResources.ViewerPlus_Edit_UploadCustomDefaultThumbnail,
            zoomIn: Panopto.GlobalResources.ViewerPlus_Edit_ZoomIn,
            zoomOut: Panopto.GlobalResources.ViewerPlus_Edit_ZoomOut,
            getStreamName: function(e, t) {
                return ae(e, void 0, !0, t)
            },
            presentationName: Panopto.GlobalResources.ViewerPlus_Edit_PresentationViewTitle,
            noThumbnailUrl: Panopto.cacheRoot + "/Images/no_thumbnail.svg"
        }),
        u = p = new PanoptoTS.Core.UI.Components.Editor.TimelineState(n,s,v,[],ee,r.referencedSessions,[],U),
        T.push(p),
        Ce(),
        function() {
            var e = p.cuts()
              , t = []
              , n = PanoptoTS.Viewer.Constants.BoundaryCutTolerance * Panopto.Core.Constants.TimelineChunkMultiplier;
            _.each(e, (function(e) {
                var o = _.find(p.streams(), (function(t) {
                    return t.id === e.targetId
                }
                ))
                  , i = o ? o.duration : p.duration() + p.firstPrimaryOffset()
                  , a = e.start
                  , r = e.end()
                  , s = o ? 0 : p.firstPrimaryOffset();
                a >= i || e.end() <= s || e.duration <= 0 ? t.push(e) : (a < s && (e.start = s),
                (r > i || Math.abs(r - i) < n) && (e.duration = i - a))
            }
            )),
            _.each(t, (function(t) {
                e.splice(e.indexOf(t), 1)
            }
            ))
        }(),
        L && (Panopto.Core.ServiceInterface.MultipartUploadManager = Panopto.Core.ServiceInterface.UploadV2.MultipartUploadManager,
        Panopto.Core.ServiceInterface.MultipartUploadManager.setIsS3Upload(x)),
        !window.slideUploader) {
            var te = e.debug ? PanoptoTS.Viewer.Controls.StreamUploaderDebug : PanoptoTS.Viewer.Controls.StreamUploader;
            window.slideUploader = new te({
                sessionId: o.id,
                supportedExtensions: [".ppt", ".pptx"],
                supportedStreamTypes: [Panopto.Core.StreamType.SecondaryPresentation],
                showStartTime: !1
            },i,Panopto.Core.ServiceInterface.SessionUploadManagement,Panopto.Core.ServiceInterface.MultipartUploadManager)
        }
        if (!window.streamUploader) {
            te = e.debug ? PanoptoTS.Viewer.Controls.StreamUploaderDebug : PanoptoTS.Viewer.Controls.StreamUploader;
            window.streamUploader = new te({
                sessionId: o.id,
                supportedExtensions: Panopto.Core.Constants.MEDIA_UPLOAD_EXTENSIONS,
                supportedStreamTypes: [1, 2],
                showStartTime: !0
            },i,Panopto.Core.ServiceInterface.SessionUploadManagement,Panopto.Core.ServiceInterface.MultipartUploadManager)
        }
        window.streamUploader.onUploaded.add(M),
        window.streamUploader.onUpdate.add(A),
        De(m),
        g = Panopto.Viewer.Players.ThumbnailPlayer(v, t, w),
        Panopto.Core.UI.Handlers.button(G, ce),
        Panopto.Core.UI.Handlers.button(j, ue),
        Panopto.Core.UI.Handlers.button(Q, (function() {
            Q.hasClass(Panopto.Core.Constants.DisabledClass) || ge()
        }
        )),
        Panopto.Core.UI.Handlers.button(q, (function() {
            q.hasClass(Panopto.Core.Constants.DisabledClass) || Se()
        }
        )),
        pe(),
        $(document).keydown((function(e) {
            if (e.ctrlKey)
                switch (e.keyCode) {
                case Panopto.Core.Key.Y:
                    ue(),
                    e.preventDefault();
                    break;
                case Panopto.Core.Key.Z:
                    ce(),
                    e.preventDefault()
                }
        }
        )),
        Panopto.viewer.enableSilverlightEditor && K.show().find("a").attr("href", PanoptoTS.Viewer.Constants.SilverlightEditorUrlTemplate.format(o.id)),
        J.show(),
        Panopto.Core.UI.Handlers.button(J, (function() {
            R = !R,
            B.toggle(R),
            g.toggle(!R),
            J.text(R ? Panopto.GlobalResources.ViewerPlus_Edit_PreviewButtonText : Panopto.GlobalResources.ViewerPlus_Edit_TimelineButtonText).attr("title", R ? Panopto.GlobalResources.ViewerPlus_Edit_PreviewButtonTitle : Panopto.GlobalResources.ViewerPlus_Edit_TimelineButtonTitle).toggleClass("previewing", !R),
            t.resize()
        }
        )),
        $(window).on("beforeunload", (function() {
            return E ? Panopto.GlobalResources.ViewerPlus_Edit_UnsavedChanges : void 0
        }
        )),
        Panopto.Core.UI.Handlers.button(W, (function() {
            window.location.search = window.location.search.replace("&edit=true", "")
        }
        )),
        D.applyState(p),
        O.applyState(o.id, p),
        a(),
        Oe((function() {
            Ue(m)
        }
        ))
    }, De = function(e) {
        window.slidesTab ? (e && window.slidesTab.setSlideDecks(e),
        window.slidesTab.setTimelineEditor(w)) : S = e,
        window.streamTab && window.streamTab.setTimelineEditor(w)
    }, Le = function(e) {
        var t = []
          , n = []
          , o = []
          , i = [];
        if (p = p.copy(),
        T[0] = p,
        p.cuts().length = 0,
        _.each(s.streamsToUpdate, (function(e) {
            var t = _.find(p.streams(), (function(t) {
                return e.id === t.id
            }
            ));
            t ? (t.name = e.name,
            t.absoluteStart = e.absoluteStart,
            t.vrType = e.vrType,
            t.normalizeVolume = e.normalizeVolume) : (n.push(e),
            s.cutsToReplace = _.filter(s.cutsToReplace, (function(t) {
                return t.targetId !== e.id
            }
            )),
            s.eventsToAdd = _.filter(s.eventsToAdd, (function(t) {
                return t.streamId !== e.id
            }
            )),
            s.eventsToUpdate = _.filter(s.eventsToUpdate, (function(t) {
                return t.streamId !== e.id
            }
            )),
            s.eventsToDelete = _.filter(s.eventsToDelete, (function(t) {
                return t.streamId !== e.id
            }
            )))
        }
        )),
        _.each(n, (function(e) {
            s.streamsToUpdate.splice(s.streamsToUpdate.indexOf(e), 1)
        }
        )),
        _.each(s.cutsToReplace, (function(e) {
            p.cuts().push(e)
        }
        )),
        _.each(s.slideDecksToDelete, (function(t) {
            _.find(e, (function(e) {
                return t.id === e.id
            }
            )) ? p.slideDecksToDelete().push(t) : o.push(t)
        }
        )),
        _.each(o, (function(e) {
            s.slideDecksToDelete.splice(s.slideDecksToDelete.indexOf(e), 1)
        }
        )),
        _.each(s.eventsToAdd, (function(e) {
            e.type === Panopto.Core.EventType.SpeechRecognition && (e.forceShow = !0),
            p.events().push(e)
        }
        )),
        _.each(s.eventsToUpdate, (function(e) {
            var t = p.events()[_.findIndex(p.events(), (function(t) {
                return e.id === t.id
            }
            ))];
            t ? (t.edited = !0,
            t.name = e.name,
            t.metadata = e.metadata,
            t.timelineTime = e.timelineTime,
            t.link = e.link,
            t.isDefaultThumbnail = e.isDefaultThumbnail) : i.push(e)
        }
        )),
        _.each(i, (function(e) {
            s.eventsToUpdate.splice(s.eventsToUpdate.indexOf(e), 1)
        }
        )),
        i.length = 0,
        _.each(s.eventsToDelete, (function(e) {
            var t = _.find(p.events(), (function(t) {
                return e.id === t.id
            }
            ));
            t ? p.events().splice(p.events().indexOf(t), 1) : i.push(e)
        }
        )),
        _.each(i, (function(e) {
            s.eventsToDelete.splice(s.eventsToDelete.indexOf(e), 1)
        }
        )),
        _.each(s.questionListRevisions, (function(e) {
            var t = _.findIndex(p.questionLists(), (function(t) {
                return e.id === t.id
            }
            ))
              , n = new PanoptoTS.Models.Editor.EditableQuestionList;
            n.copyFromClientModel(e),
            t >= 0 ? (n.isEdited = !0,
            p.questionLists()[t] = n) : (n.id = _.uniqueId("questionList"),
            p.questionLists().push(n))
        }
        )),
        _.each(s.questionListIdsToDelete, (function(e) {
            p.questionLists().splice(_.findIndex(p.questionLists(), (function(t) {
                return e === t.id
            }
            )), 1)
        }
        )),
        _.each(s.sessionReferences.toAdd, (function(e) {
            t.push(function(e) {
                return ne(e.referencedSessionId, e.start, e.order).done((function(t) {
                    p.sessionReferences.push(t),
                    _.each(e.cuts, (function(e) {
                        p.cuts().push(Panopto.Core.ServiceInterface.Rest.Objects.Cut({
                            TargetType: Panopto.Core.ServiceInterface.Rest.Objects.TypeName.SessionReference,
                            TargetId: t.id,
                            Start: e.start * Panopto.Core.Constants.TimelineChunkMultiplier,
                            Duration: e.duration * Panopto.Core.Constants.TimelineChunkMultiplier
                        }))
                    }
                    ))
                }
                ))
            }(e))
        }
        )),
        _.each(s.sessionReferences.toUpdate, (function(e) {
            var t = _.findIndex(p.sessionReferences, (function(t) {
                return e.id === t.id
            }
            ));
            if (t > -1) {
                var n = p.sessionReferences[t].copy(!0, {
                    order: e.order,
                    start: e.start
                });
                p.sessionReferences.splice(t, 1, n)
            }
        }
        )),
        _.each(s.sessionReferences.toDelete, (function(e) {
            var t = _.findIndex(p.sessionReferences, (function(t) {
                return e === t.id
            }
            ));
            p.sessionReferences.splice(t, 1)
        }
        )),
        s.streamChanges) {
            if (s.streamChanges.toAdd)
                _.each(s.streamChanges.toAdd, (function(e) {
                    var t = new AutoClientModels.StreamCreate;
                    t.copyFromStreamCreate(e),
                    p.addedStreams.push(t)
                }
                ));
            s.streamChanges.toDelete && s.streamChanges.toDelete.forEach((function(e) {
                var t = _.findIndex(p.streams(), (function(t) {
                    return t.id === e.streamId
                }
                ));
                -1 !== t && p.streams().splice(t, 1)
            }
            ))
        }
        return p.setNormalizeVolume(s.normalizeVolume),
        $.when.apply($, t)
    }, xe = function() {
        t.toggleMessage(Panopto.GlobalResources.ViewerPlus_UnknownError, Panopto.GlobalResources.ViewerPlus_ContactSupport, $(".support-email").attr("href"))
    }, Oe = function(e) {
        Panopto.Core.ServiceInterface.Rest.SessionReferences.get({
            referencedSessionId: o.id
        }, (function(n) {
            n.results.length > Panopto.viewer.spliceHostReprocessLimit ? t.toggleMessage(Panopto.Core.StringHelpers.format(Panopto.GlobalResources.ViewerPlus_Edit_MaxReferencedSessionsExceeded, Panopto.viewer.spliceHostReprocessLimit)) : (n.results.length && (alert(Panopto.Core.StringHelpers.format(1 === n.results.length ? Panopto.GlobalResources.ViewerPlus_Edit_HasReferencedSession : Panopto.GlobalResources.ViewerPlus_Edit_HasReferencedSessions, n.results.length)),
            c.setCanAddClip(!1)),
            e())
        }
        ), xe)
    }, Ue = function(e) {
        var n = function() {
            s = Panopto.Core.ServiceInterface.Rest.Objects.SessionChangeSet({
                sessionId: o.id
            }),
            de()
        }
          , i = function(n) {
            Panopto.Core.ServiceInterface.Rest.SessionChangeSets.updateOwner(n.id, void 0, (function(n) {
                s = n,
                Le(e).done((function() {
                    t.toggleMessage(void 0),
                    p.refreshTimeline(),
                    l.cuts(p.cuts()),
                    Ce(),
                    de(),
                    Pe()
                }
                ))
            }
            ), xe)
        };
        Panopto.Core.ServiceInterface.Rest.SessionChangeSets.get(o.id, (function(e) {
            var o = e.results[0];
            o ? o.ownerId !== Panopto.user.userId ? (t.toggleMessage(_.template($("#pendingEditsMessageTemplate").html())({
                message: Panopto.GlobalResources.ViewerPlus_Edit_PendingChanges.format(o.ownerName, Panopto.Core.TimeHelpers.utcDateToFormattedString(Panopto.Core.TimeHelpers.toLocalPanoptoTime(o.updateDate, Panopto.timeZone), "LLL")),
                claim: Panopto.GlobalResources.ViewerPlus_Edit_TakeOver.format(o.ownerName),
                discard: Panopto.GlobalResources.ViewerPlus_Edit_Discard.format(o.ownerName)
            })),
            Panopto.Core.UI.Handlers.button($(".pending-edits-claim"), (function() {
                i(o)
            }
            )),
            Panopto.Core.UI.Handlers.button($(".pending-edits-discard"), (function() {
                Panopto.Core.ServiceInterface.Rest.SessionChangeSets.deleteChangeSet(o.id, (function() {
                    t.toggleMessage(void 0),
                    n()
                }
                ), xe)
            }
            ))) : i(o) : n()
        }
        ), xe)
    };
    n.eventPane.onTabSetChanged = function(e) {
        V = e.editEventTabs,
        v = e.editCutTab,
        y = e.editStreamTab,
        P = e.editQuestionListTab,
        De(S),
        S = void 0
    }
    ,
    Panopto.Core.ServiceInterface.Rest.Sessions.getOne(o.id, (function(e) {
        var t, n = [];
        m = (r = e).referencedSessions,
        _.each(m, (function(e) {
            n.push(te(e))
        }
        ));
        var a, s = $.Deferred();
        n.push(s),
        i.getAllStreams(o.id, (function(e) {
            t = e,
            s.resolve()
        }
        ), (function() {
            s.reject()
        }
        ));
        var l, d = $.Deferred();
        n.push(d),
        Panopto.Core.ServiceInterface.Rest.Sessions.getAllCuts(o.id, (function(e) {
            a = e,
            d.resolve()
        }
        ), (function() {
            d.reject()
        }
        ));
        var c, u = $.Deferred();
        n.push(u),
        Panopto.Core.ServiceInterface.Rest.Sessions.getAllSlideDecks(o.id, (function(e) {
            l = e,
            u.resolve()
        }
        ), (function() {
            u.reject()
        }
        ));
        var p, f = $.Deferred();
        n.push(f),
        Panopto.Core.ServiceInterface.Rest.Sessions.getAllEvents(o.id, {
            eventTypes: [Panopto.Core.EventType.Label, Panopto.Core.EventType.SpeechRecognition, Panopto.Core.EventType.SmartOcrToc, Panopto.Core.EventType.CandidateSmartOcrToc, Panopto.Core.EventType.DefaultThumbnail],
            pageSize: Panopto.viewer.timelineEditorEventsPageSize
        }, (function(e) {
            c = e,
            f.resolve()
        }
        ), (function() {
            f.reject()
        }
        ));
        var h, v = $.Deferred();
        n.push(v),
        Panopto.Core.ServiceInterface.Rest.Sessions.getAllSlideEvents(o.id, {
            pageSize: Panopto.viewer.timelineEditorEventsPageSize
        }, (function(e) {
            p = e,
            v.resolve()
        }
        ), (function() {
            v.reject()
        }
        ));
        var y, P = $.Deferred();
        n.push(P),
        Panopto.Core.ServiceInterface.Rest.Sessions.getAllCaptions(o.id, {
            pageSize: Panopto.viewer.timelineEditorEventsPageSize,
            GetAllLanguages: !0
        }, (function(e) {
            h = e,
            P.resolve()
        }
        ), (function() {
            P.reject()
        }
        ));
        var g = $.Deferred();
        n.push(g),
        Panopto.Core.ServiceInterface.Rest.Sessions.getAllQuestionLists(o.id, (function(e) {
            y = e,
            g.resolve()
        }
        ), (function() {
            g.reject()
        }
        )),
        $.when.apply($, n).then((function() {
            Re(t, a, l, c, p, h, y, o.normalizeVolume)
        }
        )).fail((function() {
            xe()
        }
        ))
    }
    ), xe);
    var Me = new PanoptoTS.Viewer.Controls.OverlayUploader(t,D);
    Me.setAbsoluteSessionStart(o.date);
    var Ae = new PanoptoTS.Viewer.Controls.OverlayController(t.pageStructureElements(),Me,Panopto.GlobalResources);
    return Ae.onShowOverlays.add((function() {
        t.forceLeftPlayerHeight = !0,
        t.resize()
    }
    )),
    Ae.onCloseOverlays.add((function() {
        t.forceLeftPlayerHeight = !1,
        t.resize()
    }
    )),
    w.resize = function(e) {
        c.resize(e)
    }
    ,
    w.synchronize = function(e, n) {
        var o = t.activePrimary()
          , i = t.activeSecondary()
          , a = i && (_.find(p.streams(), (function(e) {
            return e.id === i.id
        }
        )) || i.id === PanoptoTS.Viewer.Constants.SlideDeckId);
        c.synchronize(e * Panopto.Core.Constants.TimelineChunkMultiplier, {
            playing: n,
            primaryAudioOnly: o && o.type === Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Audio,
            secondaryAvailable: a,
            canAddContent: O.isValidTimeForEvent(e),
            canAddEmbedEvent: O.isValidTimeForEmbeddedEvent(e),
            normalizeVolume: p.getNormalizeVolume()
        }),
        g.position(e),
        H.fire({
            canAddContent: O.isValidTimeForEvent(e),
            canAddEmbedEvent: O.isValidTimeForEmbeddedEvent(e)
        })
    }
    ,
    w.timelinePosition = function(e, t) {
        return d && b && !e ? d.timelinePosition(t) : t
    }
    ,
    w.timelineEndPosition = function() {
        return d && b ? d.timelineEndPosition() : p.duration() / Panopto.Core.Constants.TimelineChunkMultiplier
    }
    ,
    w.pushEdit = fe,
    w.applyState = le,
    w.openEventDialog = function(e) {
        var t = _.find(p.events(), (function(t) {
            return t.id === e
        }
        ));
        _.find(V, (function(e) {
            return e.ownsEvent(t)
        }
        )).openEditDialog(t),
        Z.hide()
    }
    ,
    w.removeEvent = function(e) {
        fe(),
        p.events().splice(_.findIndex(p.events(), (function(t) {
            return t.id === e
        }
        )), 1),
        le(),
        Z.hide()
    }
    ,
    w.resizeCut = Te,
    w.addQuestionList = Ve,
    w.applyPrimaryHeuristicCuts = Ce,
    w.validateEventTime = function(e) {
        var t = e / Panopto.Core.Constants.TimelineChunkMultiplier;
        return p.isTimeInSessionReference(t) ? {
            valid: !1,
            nextValidTime: p.findNextTimeNotInSessionReference(t) / Panopto.Core.Constants.TimelineChunkMultiplier
        } : {
            valid: !0,
            nextValidTime: void 0
        }
    }
    ,
    w.getQuestionList = function(e) {
        var t = _.find(p.questionLists(), (function(t) {
            return t.id === e
        }
        ))
          , n = t.toClientModel();
        return n.sessionRelativeTime = D.toUneditedFirstPrimaryRelative(t.firstStreamRelativeTicks).ticks(),
        n
    }
    ,
    w.updateQuestionList = function(e) {
        fe();
        var n = new AutoClientModels.QuestionList;
        n.copyFromQuestionList(e);
        var o = new PanoptoTS.Models.Editor.EditableQuestionList;
        o.copyFromClientModel(n),
        o.isEdited = !0;
        var i = new PanoptoTS.Core.Logic.Time.UneditedFirstPrimaryRelative(n.sessionRelativeTime);
        o.firstStreamRelativeTicks = D.toFirstStreamRelative(i);
        var a = _.find(p.questionLists(), (function(e) {
            return e.id === o.id
        }
        ));
        p.questionLists().splice(p.questionLists().indexOf(a), 1, o);
        var r = a.firstStreamRelativeTicks.ticks() !== o.firstStreamRelativeTicks.ticks();
        return p.refreshTimeline(),
        le(a.name === o.name && !r),
        r && t.setPosition(i.seconds()),
        n
    }
    ,
    w.removeQuestionList = function(e) {
        fe();
        var t = p.questionLists()
          , n = _.find(t, (function(t) {
            return e.id === t.id
        }
        ));
        t.splice(t.indexOf(n), 1),
        le()
    }
    ,
    w.getEvent = ke,
    w.updateEvent = function(e) {
        fe();
        var n = Panopto.Core.ServiceInterface.Rest.Objects.Event(e);
        n.edited = !0;
        var o = new PanoptoTS.Core.Logic.Time.UneditedFirstPrimaryRelative(e.sessionRelativeTime);
        n.timelineTime = D.toWin32EpochRelative(o).ticks();
        var i = ke(n.id);
        p.events().splice(p.events().indexOf(i), 1, n);
        var a = i.timelineTime !== n.timelineTime;
        return p.refreshTimeline(),
        le(i.name === n.name && !a),
        a && t.setPosition(p.calculateEditorTimeFromAbsolute(n.timelineTime)),
        n.sessionRelativeTime = e.sessionRelativeTime,
        n
    }
    ,
    w.highlightEventView = function(e, t) {
        e.typeName === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.SessionReference && c.highlightSpliceView(e, t)
    }
    ,
    w.getStreamFriendlyType = ie,
    w.getStream = oe,
    w.getStreamName = ae,
    w.getStreamIconClass = function(e, t) {
        var n;
        switch ((e = e || oe(t)).type) {
        case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Screen:
        case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Slide:
            n = PanoptoTS.Viewer.Constants.ScreenCaptureClass;
            break;
        case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Audio:
        case Panopto.Core.ServiceInterface.Rest.Objects.StreamContentType.Camera:
        default:
            n = PanoptoTS.Viewer.Constants.ObjectVideoTabClass
        }
        return n
    }
    ,
    w.getDeliveryId = function() {
        return o.id
    }
    ,
    w.savedEvents = function() {
        return f
    }
    ,
    w.activeState = function() {
        return p
    }
    ,
    w.streamTab = function() {
        return y
    }
    ,
    w.getViewerPosition = function() {
        return t.getPosition()
    }
    ,
    w.setViewerPosition = function(e) {
        t.setPosition(e)
    }
    ,
    w.session = function() {
        return r
    }
    ,
    w.deregisterCallbacks = function() {
        window.streamUploader.onUploaded.remove(M),
        window.streamUploader.onUpdate.remove(A)
    }
    ,
    w.toggleSecondaryPlaceholder = function(e) {
        Ae.toggleSecondaryPlaceholder(e)
    }
    ,
    w.onAddContentRequirementChanged = H,
    w.overlayController = Ae,
    w.eventService = O,
    w.timeConverter = D,
    w
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Data = Panopto.Viewer.Data || {},
Panopto.Viewer.Data.Channel = function(e, t, n) {
    return {
        value: e,
        name: t || e,
        isUser: n
    }
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Data = Panopto.Viewer.Data || {},
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e() {}
                return e.createBaseContent = function(e, t, n, o, i, a, r, s, l, d, c, u) {
                    var p = (o = o || [])[0];
                    return {
                        title: e,
                        id: t,
                        tabClass: n,
                        iconClass: a,
                        iconCode: r,
                        timeline: o,
                        relativeStartTime: p,
                        absoluteStartTime: i = i || p,
                        hiddenTab: s,
                        pauseWhenAvailable: l,
                        isSessionPlaybackBlocking: d,
                        isBroadcast: c,
                        isSecondaryPaneOnly: u
                    }
                }
                ,
                e
            }();
            e.ContentHelpers = t
        }(e.Data || (e.Data = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = function() {
                function t(e) {
                    var t = e.Url || e.URL;
                    if (t) {
                        t = window.location.protocol + "//" + t.replace(/^.*?:\/\//, "")
                    }
                    var n = "number" != typeof e.Time
                      , o = this.constructBaseObject(e, t, n);
                    _.extend(this, o),
                    this.url = t,
                    this.isPdf = n,
                    this.isQuiz = e.IsQuestionList
                }
                return t.prototype.constructBaseObject = function(t, n, o) {
                    var i = t.Caption || (t.FileName ? decodeURIComponent(t.FileName) : Panopto.GlobalResources.ViewerPlus_Website)
                      , a = t.ID || t.PublicId || t.PublicID
                      , r = [];
                    o ? r.push(0) : (r.push(t.Time),
                    r.push(t.Time + PanoptoViewer.Constants.UrlEventDuration));
                    var s = -1 !== n.indexOf(PanoptoViewer.Constants.YouTubeEmbedBaseUrl)
                      , l = o ? Panopto.Core.Constants.DocumentIconCode : t.IsQuestionList ? Panopto.Core.Constants.QuestionListIconCode : s ? void 0 : Panopto.Core.Constants.LinkIconCode
                      , d = s ? e.Viewer.Constants.YouTubeIconClass : void 0;
                    return e.Viewer.Data.ContentHelpers.createBaseContent(i, a, o ? "pdf" : e.Viewer.Constants.UrlTabClass, r, void 0, d, l, t.IsQuestionList, !o, t.IsSessionPlaybackBlocking, !1, !0)
                }
                ,
                t
            }();
            t.Document = n
        }(t.Data || (t.Data = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function(e) {
                var t = e.EventTargetType || "UserCreatedTranscript"
                  , n = e.ID || e.EventID
                  , o = n || e.PublicId !== Panopto.Core.Constants.EmptyGuid && e.PublicId
                  , i = o ? "event" + o : (t + "-" + e.Time).replace(/\./gi, "")
                  , a = _.contains(["Transcript", "UserCreatedTranscript"], t)
                  , r = _.contains(["ObjectVideo", "Primary", "PowerPoint", "SmartOcrToc"], t)
                  , s = a ? e.Data || e.Caption : r ? e.Caption : e.Caption || e.Data
                  , l = (e.UserName || "").toLowerCase()
                  , d = t.replace(" ", "");
                "Questions" === d && (d = "Comments"),
                this.id = i,
                this.eventId = n,
                this.eventPublicId = e.PublicId,
                this.sessionId = e.SessionID,
                this.time = e.Time,
                this.creationTime = e.CreationTime,
                this.text = s,
                this.user = l,
                this.userDisplayName = e.UserDisplayName || l,
                this.type = d,
                this.isQuestionList = e.IsQuestionList,
                this.saved = !0,
                this.createdDuringWebcast = "Comments" === d && e.CreatedDuringWebcast,
                this.url = e.Url
            };
            e.Event = t
        }(e.Data || (e.Data = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Data = Panopto.Viewer.Data || {},
Panopto.Viewer.Data.Slide = function(e) {
    return {
        time: e.Time,
        absoluteTime: e.AbsoluteTime,
        queryParams: {
            id: e.ObjectIdentifier,
            number: e.ObjectSequenceNumber,
            x: void 0
        }
    }
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Data = Panopto.Viewer.Data || {},
Panopto.Viewer.Data.SlideDeck = function(e) {
    var t = _.map(e, Panopto.Viewer.Data.Slide);
    t[0].time = 0;
    var n = [t[0].time]
      , o = PanoptoTS.Viewer.Data.ContentHelpers.createBaseContent(Panopto.GlobalResources.ViewerPlus_SlidesTitle, PanoptoTS.Viewer.Constants.SlideDeckId, PanoptoTS.Viewer.Constants.SlideDeckTabClass, n, t[0].absoluteTime, "", "", !1, !1, !1, !1, !1);
    return o.slides = t,
    o
}
,
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e() {}
                return e.convertDeliveryToModel = function(e) {
                    return e.map((function(e) {
                        var t = new AutoClientModels.TagSearchItem;
                        return t.content = e.Content,
                        t.usageCount = e.UsageCount,
                        t.id = e.PublicId,
                        t
                    }
                    ))
                }
                ,
                e
            }();
            e.TagHelper = t
        }(e.Data || (e.Data = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            var n = function(t, n) {
                this.time = t.Time,
                this.text = t.Caption,
                this.queryParams = {
                    eventTargetPID: t.ObjectPublicIdentifier,
                    sessionPID: t.SessionID,
                    number: t.ObjectSequenceNumber,
                    isPrimary: "Primary" === t.EventTargetType || "SmartOcrToc" === t.EventTargetType,
                    absoluteTime: t.AbsoluteTime
                },
                this.isSlide = "PowerPoint" === t.EventTargetType,
                t.ObjectStreamID !== Panopto.Core.Constants.EmptyGuid ? this.tabId = t.ObjectStreamID : this.isSlide && (this.tabId = n ? n.id : e.Viewer.Constants.SlideDeckId)
            };
            t.Thumbnail = n
        }(t.Data || (t.Data = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
__extends = this && this.__extends || function() {
    var e = function(t, n) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        ,
        e(t, n)
    };
    return function(t, n) {
        if ("function" != typeof n && null !== n)
            throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function o() {
            this.constructor = t
        }
        e(t, n),
        t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype,
        new o)
    }
}();
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
Panopto.Viewer.PlayState = Panopto.Viewer.PlayState || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
Panopto.Viewer.Hive = Panopto.Viewer.Hive || {};
var ksdn = ksdn || {};
!function(e) {
    !function(t) {
        !function(t) {
            var n = e.Viewer.Constants
              , o = Panopto.Viewer.PlayState
              , i = Panopto.Viewer.Analytics
              , a = (e.Viewer.MBRBitrate,
            Panopto.Viewer.Hive)
              , r = PanoptoCore.Logging.Logger
              , s = function() {
                function s(o, l, d) {
                    var c = this;
                    this.helpers = d,
                    this.onReady = $.Deferred(),
                    this.isMediaReady = !1,
                    this.currentLevel = 0,
                    this.requestedPosition = void 0,
                    this.requestedStartPosition = void 0,
                    this.requestedContentUri = void 0,
                    this.requestedVrType = void 0,
                    this.readyQueue = {
                        name: "ready"
                    },
                    this.isBroadcast = !1,
                    this.isStreamOptimized = !1,
                    this.playerEvents = {
                        ready: {
                            name: "ready"
                        },
                        resumed: {
                            name: "resume"
                        },
                        paused: {
                            name: "pause"
                        },
                        stopped: {
                            name: "stop"
                        },
                        finish: {
                            name: "finish"
                        },
                        qualityChange: {
                            name: "quality"
                        },
                        speedChange: {
                            name: "speed"
                        },
                        volumeChange: {
                            name: "volume"
                        },
                        muteChange: {
                            name: "mute"
                        }
                    },
                    this.triggers = {
                        load: {
                            name: "load"
                        },
                        ready: {
                            name: "ready"
                        },
                        play: {
                            name: "play"
                        },
                        pause: {
                            name: "pause"
                        },
                        stop: {
                            name: "stop"
                        },
                        finish: {
                            name: "finish"
                        },
                        updatePosition: {
                            name: "updatePosition"
                        },
                        updateBitrate: {
                            name: "updateBitrate"
                        },
                        updateSpeed: {
                            name: "updateSpeed"
                        },
                        updateVolume: {
                            name: "updateVolume"
                        },
                        updateMuted: {
                            name: "updateMuted"
                        }
                    },
                    this.states = {
                        uninitialized: {
                            name: "uninitialized"
                        },
                        loaded: {
                            name: "loaded",
                            triggerOnEnter: this.triggers.ready
                        },
                        playing: {
                            name: "playing"
                        },
                        paused: {
                            name: "paused"
                        },
                        finished: {
                            name: "finished"
                        },
                        stopping: {
                            name: "stopping",
                            triggerOnEnter: this.triggers.load
                        },
                        stopped: {
                            name: "stopped",
                            triggerOnEnter: this.triggers.load
                        }
                    },
                    this.transitions = {
                        play: {
                            trigger: this.triggers.play,
                            toState: this.states.playing,
                            action: function(e, t) {
                                c.component.playing ? t() : (c.component.play(),
                                c.setBufferingTimeout(!0))
                            },
                            exitEvent: this.playerEvents.resumed
                        },
                        pause: {
                            trigger: this.triggers.pause,
                            toState: this.states.paused,
                            action: function(e, t) {
                                c.component.playing ? (c.component.pause(),
                                c.clearBufferingTimeout()) : t()
                            },
                            exitEvent: this.playerEvents.paused
                        },
                        ready: {
                            trigger: this.triggers.ready,
                            action: function(e, t) {
                                c.qualityReporter = i.QualityReporter({
                                    streamUrl: e.content.url,
                                    isBroadcast: e.content.isBroadcast,
                                    isAudioOnly: e.content.isAudioOnly,
                                    minDuration: n.QualityReportThreshold
                                }),
                                e.onLoad && e.onLoad(),
                                _.each(c.video.textTracks, (function(e) {
                                    e.mode = "disabled"
                                }
                                )),
                                c.video.textTracks.onaddtrack = function(e) {
                                    e.track.mode = "disabled"
                                }
                                ,
                                c.isPrimary || c.component.mute(!0),
                                e.playSpeed && c.component.speed(e.playSpeed),
                                c.setHlsJsEngineEvents(),
                                c.component.video.width && c.component.video.height ? c.helpers.resize() : c.component.one("progress", (function() {
                                    c.helpers.resize()
                                }
                                )),
                                c.isMediaReady = !0,
                                t()
                            },
                            releaseQueue: this.readyQueue
                        },
                        finish: {
                            trigger: this.triggers.finish,
                            triggerEvent: this.playerEvents.finish,
                            toState: this.states.finished
                        },
                        initialLoad: {
                            trigger: this.triggers.load,
                            toState: this.states.loaded,
                            action: function(t, o) {
                                c.isBroadcast = t.content.isBroadcast,
                                c.broadcastSegmentDuration = t.content.broadcastSegmentDuration,
                                c.broadcastSegmentBackoff = t.content.broadcastSegmentBackoff;
                                var i = c.generatePlayerConfiguration(t);
                                t.startPosition && (i.hlsjs.startPosition = t.startPosition);
                                var s = o;
                                c.isBroadcast && a.isHiveOptimized(t.content.optimizationToken) && (s = function() {
                                    o(),
                                    c.webcastDurationEstimator = new e.Viewer.Logic.HlsJsWebcastDurationEstimator(c.component,Panopto.viewer.enableWebcastServerAgeFactor)
                                }
                                ),
                                c.component = c.initializeFlowplayerComponent(i, t, s),
                                c.isBroadcast && !a.isHiveOptimized(t.content.optimizationToken) && (c.webcastDurationEstimator = new e.Viewer.Logic.HlsJsWebcastDurationEstimator(c.component,Panopto.viewer.enableWebcastServerAgeFactor)),
                                c.video = c.$container.find("video")[0];
                                var l, d, u = c.isPrimary ? "primary" : "secondary", p = function(e) {
                                    return r.verbose("[<video/>] [" + u + "] > " + e.type + " event")
                                };
                                ["durationchange", "ended", "error", "loadeddata", "loadedmetadata", "pause", "play", "playing", "seeked", "seeking", "stalled", "waiting"].forEach((function(e) {
                                    return c.video.addEventListener(e, p)
                                }
                                )),
                                c.$container.find(".fp-ui").click((function() {
                                    return !1
                                }
                                )).mousedown((function(e) {
                                    l = e.pageX,
                                    d = e.pageY
                                }
                                )).mouseup((function(e) {
                                    1 === e.which && l === e.pageX && d === e.pageY && c.helpers.togglePlaying()
                                }
                                )),
                                c.component.on("progress", (function() {
                                    c.component.playing && c.setBufferingTimeout(!0)
                                }
                                )),
                                setInterval((function() {
                                    return c.checkForBuffering
                                }
                                ), n.BufferingTimeoutThreshold)
                            }
                        },
                        load: {
                            trigger: this.triggers.load,
                            toState: this.states.loaded,
                            action: function(e, t) {
                                e.clip.sources[0].src !== c.component.video.sources[0].src || e.clip.vr !== c.component.video.vr ? (c.hlsjs && (c.hlsjs.config.startPosition = e.startPosition || -1),
                                c.loadClipIntoComponent(e)) : t()
                            },
                            exitEvent: this.playerEvents.ready
                        },
                        stop: {
                            trigger: this.triggers.load,
                            action: function(e, t) {
                                c.flushQualityReport(),
                                c.component.stop()
                            },
                            exitEvent: this.playerEvents.stopped,
                            toState: this.states.stopped
                        },
                        inactiveSet: [{
                            trigger: this.triggers.play,
                            delayToQueue: this.readyQueue
                        }, {
                            trigger: this.triggers.pause,
                            delayToQueue: this.readyQueue
                        }, {
                            trigger: this.triggers.updatePosition,
                            delayToQueue: this.readyQueue
                        }, {
                            trigger: this.triggers.updateBitrate,
                            delayToQueue: this.readyQueue
                        }, {
                            trigger: this.triggers.updateSpeed,
                            delayToQueue: this.readyQueue
                        }, {
                            trigger: this.triggers.updateVolume,
                            delayToQueue: this.readyQueue
                        }, {
                            trigger: this.triggers.updateMuted,
                            delayToQueue: this.readyQueue
                        }],
                        activeSet: [{
                            trigger: this.triggers.updatePosition,
                            action: function(t, n) {
                                if (t === c.requestedPosition) {
                                    var o = c.clampPosition(t);
                                    c.requestedPosition = o;
                                    var i = function() {
                                        c.requestedPosition === o && (c.requestedPosition = void 0),
                                        n()
                                    };
                                    if (!Panopto.Core.Browser.isChrome && c.component.video.time !== o || Math.abs(o - c.component.video.time) > e.Viewer.Constants.BadSeekThreshold || 0 === o) {
                                        var a = i;
                                        if ("html5" === c.component.engine.engineName) {
                                            a = function() {
                                                return setTimeout(i, 0)
                                            }
                                            ;
                                            var s = !1;
                                            $(c.video).one("progress", (function() {
                                                s || t !== c.requestedPosition || c.component.seek(o, a)
                                            }
                                            )),
                                            $(c.video).one("seeking", (function() {
                                                s = !0
                                            }
                                            ))
                                        }
                                        var l, d = $.Deferred();
                                        d.then((function() {
                                            "html5" === c.component.engine.engineName ? setTimeout(a, 0) : a()
                                        }
                                        )),
                                        c.isBroadcast && (Panopto.Core.Browser.isIE11 || Panopto.Core.Browser.isEdge || Panopto.Core.Browser.isSafari) && (l = setTimeout((function() {
                                            r.warning("WARN: forcing callback after seek timeout elapsed. Checking seek correctness. " + c.component.video.time + " vs. " + o),
                                            0 === c.component.video.time && 0 !== o && (r.warning("ERROR: Repeating seek request."),
                                            c.position(o + .01, void 0)),
                                            d.resolve()
                                        }
                                        ), e.Viewer.Constants.MissingSeekedEventTimeout)),
                                        c.component.seek(o, (function() {
                                            clearTimeout(l),
                                            d.resolve()
                                        }
                                        ))
                                    } else
                                        i()
                                } else
                                    n()
                            }
                        }, {
                            trigger: this.triggers.updateBitrate,
                            action: function(e, n) {
                                var o = t.HlsHelpers.getHlsJsQualityLevel(c.hlsjs.levels.length, e);
                                o != (c.hlsjs && c.hlsjs.autoLevelEnabled ? -1 : c.hlsjs.currentLevel) ? c.component.quality(o) : n()
                            },
                            exitEvent: this.playerEvents.qualityChange
                        }, {
                            trigger: this.triggers.updateSpeed,
                            action: function(e, t) {
                                c.component.currentSpeed !== e ? c.component.speed(e) : t()
                            },
                            exitEvent: this.playerEvents.speedChange
                        }, {
                            trigger: this.triggers.updateVolume,
                            action: function(e, t) {
                                c.component.volumeLevel != e ? c.component.volume(e) : t()
                            },
                            exitEvent: this.playerEvents.volumeChange
                        }, {
                            trigger: this.triggers.updateMuted,
                            action: function(e, t) {
                                c.component.mute(e)
                            },
                            exitEvent: this.playerEvents.muteChange
                        }, {
                            trigger: this.triggers.load,
                            toState: this.states.stopping
                        }]
                    },
                    this.isPrimary = o,
                    this.$container = l,
                    this.initialize(),
                    this.initializeTransitions();
                    var u = o ? "Primary" : "Secondary_" + s.secondaryPlayerCount;
                    this.machine = new e.Logic.StateMachine.Machine(u,this.states.uninitialized),
                    this.machine.attachEvent = function(e, t, n) {
                        return c.attachEvent(e, t, n)
                    }
                    ,
                    this.machine.detachEvent = function(e) {
                        return c.detachEvent(e)
                    }
                    ,
                    this.$bufferingIndicator = $("#" + (o ? "primaryBuffering" : "secondaryBuffering")),
                    o || s.secondaryPlayerCount++
                }
                return s.prototype.attachEvent = function(e, t, n) {
                    var o = e ? e.name : s.eventNamespace
                      , i = t ? t.name : "";
                    this.component.on(i + "." + o, n)
                }
                ,
                s.prototype.detachEvent = function(e) {
                    var t = e ? e.name : s.eventNamespace;
                    this.component.off("." + t)
                }
                ,
                s.prototype.initializeTransitions = function() {
                    this.states.uninitialized.transitions = this.transitions.inactiveSet.slice(),
                    this.states.uninitialized.transitions.push(this.transitions.initialLoad),
                    this.states.loaded.transitions = this.transitions.activeSet.slice(),
                    this.states.loaded.transitions.push(this.transitions.ready),
                    this.states.loaded.transitions.push(this.transitions.play),
                    this.states.loaded.transitions.push(this.transitions.pause),
                    this.states.playing.transitions = this.transitions.activeSet.slice(),
                    this.states.playing.transitions.push(this.transitions.pause),
                    this.states.playing.transitions.push(this.transitions.finish),
                    this.states.playing.ignoreTriggers = [this.triggers.play],
                    this.states.paused.transitions = this.transitions.activeSet.slice(),
                    this.states.paused.transitions.push(this.transitions.play),
                    this.states.paused.ignoreTriggers = [this.triggers.pause],
                    this.states.stopping.transitions = this.transitions.inactiveSet.slice(),
                    this.states.stopping.transitions.push(this.transitions.stop),
                    this.states.stopped.transitions = this.transitions.inactiveSet.slice(),
                    this.states.stopped.transitions.push(this.transitions.load),
                    this.states.finished.transitions = this.transitions.activeSet.slice(),
                    this.states.finished.transitions.push(this.transitions.play),
                    this.states.finished.transitions.push(this.transitions.pause),
                    this.states.finished.transitions.push(this.transitions.load)
                }
                ,
                s.prototype.clearBufferingTimeout = function() {
                    this.$bufferingIndicator.hide(),
                    clearTimeout(this.bufferingTimeout)
                }
                ,
                s.prototype.setBufferingTimeout = function(e) {
                    var t = this;
                    e && this.clearBufferingTimeout(),
                    this.bufferingTimeout = window.setTimeout((function() {
                        t.component.playing && (t.$bufferingIndicator.show(),
                        t.$bufferingIndicator.css({
                            top: t.$container.offset().top + (t.$container.height() - t.$bufferingIndicator.height()) / 2,
                            left: t.$container.offset().left + (t.$container.width() - t.$bufferingIndicator.width()) / 2
                        }))
                    }
                    ), n.BufferingTimeoutThreshold)
                }
                ,
                s.prototype.checkForBuffering = function() {
                    this.machine.getCurrentState() !== this.states.paused ? this.component && this.component.video && this.lastBufferingCheckPosition !== this.component.video.time ? (this.$bufferingIndicator.hide(),
                    this.lastBufferingCheckPosition = this.component.video.time) : (this.$bufferingIndicator.show(),
                    this.$bufferingIndicator.css({
                        top: this.$container.offset().top + (this.$container.height() - this.$bufferingIndicator.height()) / 2,
                        left: this.$container.offset().left + (this.$container.width() - this.$bufferingIndicator.width()) / 2
                    })) : (this.lastBufferingCheckPosition = void 0,
                    this.$bufferingIndicator.hide())
                }
                ,
                s.prototype.flushQualityReport = function() {
                    this.qualityReporter && this.qualityReporter.flushQualityReport(this.hlsjs && this.component.playing, this.component.video.time, this.currentLevel, this.hlsjs && this.hlsjs.levels && this.hlsjs.levels.length, this.hlsjs && this.hlsjs.levels && this.hlsjs.levels.length && this.hlsjs.levels[this.currentLevel].bitrate, this.hlsjs && this.hlsjs.autoLevelEnabled)
                }
                ,
                s.prototype.equalsLoadedContent = function(e) {
                    var t = !0;
                    if (e.vrType !== this.requestedVrType)
                        t = !1;
                    else if (e.url && e.url !== this.requestedContentUri) {
                        this.requestedContentUri.split("?")[0] !== e.url.split("?")[0] && (t = !1)
                    }
                    return t
                }
                ,
                s.prototype.setContent = function(e, t, n) {
                    if (!this.equalsLoadedContent(e)) {
                        this.requestedContentUri = e.url,
                        this.requestedVrType = e.vrType;
                        var o = this.generatePlayerLoadData(e, n);
                        this.machine.handleTrigger(this.triggers.load, o)
                    }
                }
                ,
                s.prototype.initialize = function() {
                    if (!flowplayer.conf.hlsjs) {
                        flowplayer.conf.fullscreen = !0,
                        flowplayer.conf.hlsjs = {
                            listeners: ["hlsLevelSwitch", "hlsLevelLoaded", "hlsMediaAttached", "hlsFragLoaded", "hlsManifestLoaded"],
                            safari: !0,
                            smoothSwitching: !1,
                            livePositionOffset: 0
                        },
                        Panopto.Core.Browser.isFirefox && (flowplayer.conf.hlsjs.maxBufferHole = PanoptoViewer.Constants.FirefoxMaxBufferHole);
                        var e = {};
                        try {
                            e = JSON.parse(Panopto.viewer.hlsJsConfig)
                        } catch (e) {
                            r.warning("Error parsing HlsJsConfig setting, ignored.")
                        }
                        _.extend(flowplayer.conf.hlsjs, e),
                        _.extend(flowplayer.conf.hlsjs, PanoptoViewer.Data.getHlsConfigQueryParams(window.location.search.slice(1))),
                        r.info("[FlowplayerMachine] hls config: " + JSON.stringify(flowplayer.conf.hlsjs))
                    }
                }
                ,
                s.prototype.clampPosition = function(e) {
                    var t = 0
                      , n = this.machine.getCurrentState();
                    if ((n === this.states.finished || n === this.states.loaded || n === this.states.paused || n === this.states.playing) && this.component && this.component.video && (this.component.video.duration || Panopto.Core.Browser.isSafari)) {
                        var o = this.isBroadcast && this.webcastDurationEstimator ? this.webcastDurationEstimator.getDuration() - this.broadcastSegmentBackoff * this.broadcastSegmentDuration : this.component.video.duration;
                        t = Math.max(0, Math.min(e, o))
                    }
                    return t
                }
                ,
                s.prototype.generatePlayerConfiguration = function(e) {
                    var t = -1 !== window.location.search.indexOf("debuglog=true");
                    return this.isBroadcast && (this.broadcastSegmentBackoff && 3 !== this.broadcastSegmentBackoff || !Panopto.viewer.enableServerBasedBackoffCalculation) && _.extend(flowplayer.conf.hlsjs, {
                        initialLiveManifestSize: this.broadcastSegmentBackoff,
                        liveSyncDurationCount: this.broadcastSegmentBackoff
                    }),
                    {
                        key: Panopto.viewer.flowplayerKey,
                        clip: e.clip,
                        chromecast: !Panopto.features.disableFeaturesRequiringExternalNetworkAccess,
                        vrvideo: {
                            mode: e.content.vrType === PanoptoViewer.MediaVRType.Full ? "full" : e.content.vrType === PanoptoViewer.MediaVRType.Half ? "half" : void 0,
                            renderOnPause: !0
                        },
                        dvr: !0,
                        debug: t,
                        hlsjs: _.extend({
                            debug: new PanoptoViewer.HlsjsDebugLogger
                        }, flowplayer.conf.hlsjs)
                    }
                }
                ,
                s.prototype.generatePlayerLoadData = function(e, t) {
                    return {
                        content: e,
                        clip: {
                            sources: [{
                                src: e.url,
                                type: -1 !== e.url.indexOf(".m3u8") ? n.HLSMimeType : n.MP4MimeType
                            }],
                            live: e.isBroadcast,
                            dvr: e.isBroadcast,
                            vr: e.vrType > PanoptoViewer.MediaVRType.None
                        },
                        onLoad: t,
                        playSpeed: this.component ? this.component.currentSpeed : void 0,
                        startPosition: this.requestedStartPosition
                    }
                }
                ,
                s.prototype.initializeFlowplayerComponent = function(e, t, n) {
                    var o = this;
                    return r.info("[FlowplayerMachine] > configuration:", JSON.stringify(e)),
                    flowplayer(this.$container[0], e, (function() {
                        o.onReady.resolve(),
                        n && n()
                    }
                    ))
                }
                ,
                s.prototype.loadClipIntoComponent = function(e) {
                    this.component.load(e.clip)
                }
                ,
                s.prototype.setHlsJsEngineEvents = function() {
                    var n = this;
                    if (!this.hlsjs) {
                        this.hlsjs = this.component.engine.hls;
                        this.hlsjs && (this.hlsjs.on("hlsManifestLoaded", (function() {
                            var o = e.Viewer.Logic.InitialStateLogic.getBitrate(!1)
                              , i = t.HlsHelpers.getHlsJsQualityLevel(n.hlsjs.levels.length, o);
                            n.hlsjs.currentLevel = i
                        }
                        )),
                        this.hlsjs.on("hlsLevelSwitched", (function(e, t) {
                            return o = t.level,
                            void (n.currentLevel !== o && (n.currentLevel = o,
                            r.info((n.isPrimary ? "Primary" : "Secondary") + " player started playing segment at quality level " + n.currentLevel + " of " + n.hlsjs.levels.length + " (" + n.hlsjs.levels[n.currentLevel].bitrate + ")"),
                            n.flushQualityReport()));
                            var o
                        }
                        )),
                        this.hlsjs.on(Hls.Events.ERROR, (function(e, t) {
                            return r.error("[HlsJs] [" + (n.isPrimary ? "primary" : "secondary") + "] > ERROR!", e, t)
                        }
                        )))
                    }
                }
                ,
                s.prototype.content = function(e, t, n) {
                    this.setContent(e, t, n)
                }
                ,
                s.prototype.position = function(t, n) {
                    if (void 0 === t) {
                        var o = this.requestedPosition || this.requestedStartPosition;
                        if (void 0 === o)
                            if (this.component && this.component.video) {
                                o = this.component.video.time;
                                var i = e.Viewer.Constants.NativePositionFallbackRegion;
                                this.video && (0 === o || o === this.video.duration || o > i && this.video.currentTime < i) && (o = this.video.currentTime)
                            } else
                                o = 0;
                        return isFinite(o) ? o : this.clampPosition(o)
                    }
                    this.requestedPosition !== t && (this.requestedPosition = t,
                    this.machine.handleTrigger(this.triggers.updatePosition, this.requestedPosition, n))
                }
                ,
                s.prototype.setStartPosition = function(e) {
                    this.requestedStartPosition = e
                }
                ,
                s.prototype.playState = function(e) {
                    e == o.Playing ? this.machine.handleTrigger(this.triggers.play) : this.machine.handleTrigger(this.triggers.pause)
                }
                ,
                s.prototype.playSpeed = function(e) {
                    this.machine.handleTrigger(this.triggers.updateSpeed, e)
                }
                ,
                s.prototype.bitrate = function(e) {
                    this.machine.handleTrigger(this.triggers.updateBitrate, e)
                }
                ,
                s.prototype.volume = function(e) {
                    this.isPrimary && this.machine.handleTrigger(this.triggers.updateVolume, e / 100)
                }
                ,
                s.prototype.muted = function(e) {
                    this.isPrimary && this.machine.handleTrigger(this.triggers.updateMuted, e)
                }
                ,
                s.prototype.isFullscreen = function(e) {
                    if (void 0 === e)
                        return this.component && this.component.isFullscreen;
                    this.component && e !== this.component.isFullscreen && (this.component.disabled = !1,
                    this.component.fullscreen())
                }
                ,
                s.prototype.width = function() {
                    return this.isMediaReady ? this.component.video.width || this.video.videoWidth : 16
                }
                ,
                s.prototype.height = function() {
                    return this.isMediaReady ? this.component.video.height || this.video.videoHeight : 9
                }
                ,
                s.prototype.ended = function() {
                    return this.machine.getCurrentState() === this.states.finished && void 0 === this.machine.getCurrentTransition()
                }
                ,
                s.prototype.streamLength = function() {
                    return this.isMediaReady ? this.component.video.duration : 0
                }
                ,
                s.prototype.numericBitrate = function() {
                    return this.isMediaReady && this.hlsjs && this.hlsjs.levels && this.hlsjs.levels[this.currentLevel] ? this.hlsjs.levels[this.currentLevel].bitrate : 0
                }
                ,
                s.prototype.bitrateOptions = function() {
                    return this.isMediaReady && this.hlsjs && this.hlsjs.levels && this.hlsjs.levels[this.currentLevel] ? _.map(this.hlsjs.levels, (function(e) {
                        return e.bitrate
                    }
                    )) : []
                }
                ,
                s.prototype.syncPlayState = function() {}
                ,
                s.prototype.syncTimes = function() {}
                ,
                s.prototype.setCaptionText = function() {}
                ,
                s.prototype.setCaptionStyles = function() {}
                ,
                s.prototype.showShadow = function() {}
                ,
                s.prototype.canMoveAudioPlayerOffscreen = function() {
                    return !0
                }
                ,
                s.eventNamespace = "machine",
                s.secondaryPlayerCount = 0,
                s
            }();
            t.FlowplayerMachine = s;
            var l = function(t) {
                function n() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return __extends(n, t),
                n.prototype.clampPosition = function(e) {
                    var n = t.prototype.clampPosition.call(this, e);
                    if (this.isBroadcast && this.webcastDurationEstimator && 0 === n) {
                        var o = this.relativeStart + this.component.video.duration;
                        n = Math.min(e, o)
                    } else if (this.isBroadcast && !this.webcastDurationEstimator && this.component.video.duration && this.broadcastSegmentBackoff && 3 !== this.broadcastSegmentBackoff) {
                        o = this.component.video.duration;
                        o -= this.broadcastSegmentBackoff * this.broadcastSegmentDuration,
                        n = Math.min(e, o)
                    }
                    return n
                }
                ,
                n.prototype.generatePlayerConfiguration = function(e) {
                    var n = t.prototype.generatePlayerConfiguration.call(this, e);
                    return a.isHiveOptimized(e.content.optimizationToken) && (n.hive = a.createFlowplayerPlugin(e.content, this.isPrimary),
                    a.attachFlowplayerHlsJsConfig(e.content, n.hlsjs),
                    this.isStreamOptimized = !0),
                    n
                }
                ,
                n.prototype.generatePlayerLoadData = function(e, n) {
                    var o = t.prototype.generatePlayerLoadData.call(this, e, n);
                    return a.isHiveOptimized(e.optimizationToken) && (o.optimizationToken = e.optimizationToken,
                    this.relativeStart = e.relativeStart),
                    o
                }
                ,
                n.prototype.loadClipIntoComponent = function(e) {
                    a.isHiveOptimized(e.optimizationToken) ? this.loadHiveTicketIntoPlayer(e, null) : t.prototype.loadClipIntoComponent.call(this, e)
                }
                ,
                n.prototype.optimizationProvider = function() {
                    return e.Viewer.Constants.Hive
                }
                ,
                n.prototype.loadHiveTicketIntoPlayer = function(e, n) {
                    var o = this
                      , i = a.getHiveSourceForReload(this.component, e);
                    a.loadHiveTicket(this.component, i, n, e, (function(e, n) {
                        t.prototype.loadClipIntoComponent.call(o, e)
                    }
                    ))
                }
                ,
                n
            }(s);
            t.HiveFlowplayerMachine = l
        }(t.Players || (t.Players = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            var t = function() {
                function e() {}
                return e.prototype.toString = function() {
                    return "Load " + this.clip.sources[0].src + " at position " + this.startPosition
                }
                ,
                e
            }();
            e.FlowplayerMachineLoadData = t
        }(e.Players || (e.Players = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(t) {
            var n = function() {
                function t() {}
                return t.getHlsJsQualityLevel = function(t, n) {
                    if (t <= 0)
                        return -1;
                    var o;
                    switch (n) {
                    case e.MBRBitrate.Medium:
                        o = Math.max(0, t - 2);
                        break;
                    case e.MBRBitrate.High:
                        o = Math.max(0, t - 1);
                        break;
                    case e.MBRBitrate.Auto:
                    default:
                        o = -1
                    }
                    return o
                }
                ,
                t
            }();
            t.HlsHelpers = n
        }(e.Players || (e.Players = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
Panopto.Viewer.PlayState = Panopto.Viewer.PlayState || {},
PanoptoLegacy.Viewer.Players.SilverlightPlayer = function(e, t) {
    var n, o, i, a, r, s, l = PanoptoTS.Viewer.Constants, d = Panopto.Viewer.PlayState, c = 0, u = function(e, t) {
        n.Position = e,
        c = void 0,
        t && t()
    }, p = function(e) {
        switch (e) {
        case d.Playing:
            n.Play();
            break;
        case d.Paused:
            n.Pause()
        }
        o = void 0
    }, f = function(e) {
        n.Bitrate = e
    }, h = function(e) {
        n.PlaySpeed = e,
        i = void 0
    }, m = function(e) {
        n.Volume = e,
        r = void 0
    }, v = function(e) {
        n.IsMuted = e,
        s = void 0
    };
    return Silverlight.Silverlight(),
    {
        content: function(d) {
            try {
                n.ContentUrl = d.url
            } catch (y) {
                Silverlight.createObjectEx({
                    source: Panopto.viewer.xapLocation,
                    parentElement: t[0],
                    id: "silverlightPlayer" + (e ? "Primary" : "Secondary"),
                    properties: {
                        width: "100%",
                        height: "100%",
                        version: l.SilverlightVersion
                    },
                    alt: "",
                    events: {
                        onLoad: function(e) {
                            (n = e.getHost().content.SilverlightPlayer).ContentUrl = d.url,
                            d.httpUrl && (n.HttpUrl = d.httpUrl),
                            c && u(c, void 0),
                            o && p(o),
                            i && h(i),
                            void 0 !== r && m(r),
                            s && v(s),
                            f(a)
                        }
                    },
                    initParams: Panopto.Core.StringHelpers.serializeObjectToInitParams({
                        isPrimary: e,
                        wmodBase: Panopto.viewer.wmodBase,
                        fullScreenControlInterval: l.FullScreenControlInterval,
                        serviceScheme: Panopto.uriScheme,
                        authCookieTimeout: Panopto.authCookieTimeoutMinutes,
                        accentColor: Panopto.Core.UI.Color.parse(Panopto.branding.accentColor).toHex(),
                        safetyAccent: Panopto.Core.UI.Color.parse(Panopto.branding.accentColor).getSafety().toHex(),
                        exitFullScreenText: Panopto.GlobalResources.ViewerPlus_ExitFullScreen
                    })
                })
            }
        },
        playState: function(e) {
            try {
                p(e)
            } catch (t) {
                o = e
            }
        },
        position: function(e, t) {
            if (void 0 !== e)
                try {
                    u(e, t)
                } catch (t) {
                    c = e
                }
            else
                try {
                    return n.Position
                } catch (e) {
                    return c
                }
        },
        ended: function() {
            try {
                return n.IsEnded
            } catch (e) {
                return !1
            }
        },
        bitrate: function(e) {
            try {
                f(e)
            } catch (t) {
                a = e
            }
        },
        numericBitrate: function() {
            try {
                return n.NumericBitrate
            } catch (e) {
                return 0
            }
        },
        bitrateOptions: function() {
            try {
                return n.BitrateOptions
            } catch (e) {
                return []
            }
        },
        playSpeed: function(e) {
            try {
                h(e)
            } catch (t) {
                i = e
            }
        },
        volume: function(e) {
            try {
                m(e)
            } catch (t) {
                r = e
            }
        },
        muted: function(e) {
            try {
                v(e)
            } catch (t) {
                s = e
            }
        },
        width: function() {
            return n.ContentWidth
        },
        height: function() {
            return n.ContentHeight
        },
        showShadow: function(e) {
            try {
                n.ShowShadow = e
            } catch (e) {}
        },
        streamLength: function() {
            try {
                return n.StreamLength
            } catch (e) {
                return 0
            }
        },
        syncPlayState: function(e) {
            try {
                n.SyncPlayState(e === d.Playing)
            } catch (e) {}
        },
        syncTimes: function(e, t) {
            try {
                n.SyncTimes(e, t)
            } catch (e) {}
        },
        isFullscreen: function(e) {
            if (void 0 !== e)
                if (e)
                    ;
                else
                    try {
                        n.Minimize()
                    } catch (e) {}
            else
                try {
                    return n.IsFullscreen
                } catch (e) {
                    return !1
                }
        },
        setCaptionText: function() {},
        setCaptionStyles: function() {}
    }
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
Panopto.Viewer.PlayState = Panopto.Viewer.PlayState || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
function(e) {
    !function(t) {
        !function(t) {
            e.Viewer.Constants;
            var n = Panopto.Viewer.PlayState
              , o = (Panopto.Viewer.Analytics,
            e.Viewer.MBRBitrate,
            PanoptoCore.Logging.Logger)
              , i = function() {
                function e(e, t, n) {
                    var o = this;
                    this.isPrimary = e,
                    this.$container = t,
                    this.helpers = n,
                    this.streamPlayer = null,
                    this.startPosition = void 0,
                    this.cache = {},
                    this.bufferingStateChanged = function() {
                        var e;
                        (null === (e = o.streamPlayer) || void 0 === e ? void 0 : e.isBuffering) ? o.bufferingIndicatorDiv.style.visibility = "visible" : o.bufferingIndicatorDiv.style.visibility = "hidden"
                    }
                    ,
                    this.containerDiv = this.$container[0],
                    this.videoElement = this.$container.find("video")[0],
                    this.bufferingIndicatorDiv = document.createElement("div"),
                    this.bufferingIndicatorDiv.classList.add("bufferingIndicator"),
                    this.containerDiv.appendChild(this.bufferingIndicatorDiv),
                    PanoptoReactComponents.bootstrapReactComponent(PanoptoViewer.Controls.BufferingIndicator)($(this.bufferingIndicatorDiv), {}),
                    this.playerVolume = 1,
                    this.playerMuted = !1,
                    this.playerSpeed = 1
                }
                return e.prototype.width = function() {
                    return this.streamPlayer && this.streamPlayer.isInitialized ? this.videoElement.videoWidth || this.$container.width() : this.$container.width() || 16
                }
                ,
                e.prototype.height = function() {
                    return this.streamPlayer && this.streamPlayer.isInitialized ? this.videoElement.videoHeight || this.$container.height() : this.$container.height() || 9
                }
                ,
                e.prototype.ended = function() {
                    var e;
                    return (null === (e = this.streamPlayer) || void 0 === e ? void 0 : e.isEnded) || !1
                }
                ,
                e.prototype.streamLength = function() {
                    var e;
                    return (null === (e = this.streamPlayer) || void 0 === e ? void 0 : e.seekableDuration) || 0
                }
                ,
                e.prototype.numericBitrate = function() {
                    var e;
                    return (null === (e = this.streamPlayer) || void 0 === e ? void 0 : e.bitrate) || 0
                }
                ,
                e.prototype.bitrateOptions = function() {
                    var e;
                    return (null === (e = this.streamPlayer) || void 0 === e ? void 0 : e.bitrateOptions) || []
                }
                ,
                e.prototype.isFullscreen = function(e) {
                    return !!this.streamPlayer && (void 0 !== e && e !== this.streamPlayer.fullscreen && (this.streamPlayer.fullscreen = e),
                    this.streamPlayer.fullscreen)
                }
                ,
                e.prototype.content = function(e, t, n) {
                    var i = this
                      , a = this.streamPlayer;
                    if (a)
                        if (a.isPlaying && a.pause(),
                        a.id === e.id)
                            o.info("[SingleStreamMediaPlayer.content] Same ID we are currently viewing");
                        else if (void 0 !== this.cache[e.id]) {
                            o.info("[SingleStreamMediaPlayer.content] Pulling player out of the cache");
                            var r = this.cache[e.id];
                            this.videoElement.hidden = !0,
                            this.videoElement = r.video,
                            this.videoElement.hidden = !1,
                            this.streamPlayer = r.player
                        } else {
                            o.info("[SingleStreamMediaPlayer.content] new stream ID");
                            var s = document.createElement("video");
                            s.classList.add("video-js"),
                            this.videoElement.hidden = !0,
                            this.containerDiv.append(s),
                            this.videoElement = s,
                            this.streamPlayer = null
                        }
                    this.streamPlayer && (t ? (this.streamPlayer.dispose(),
                    this.streamPlayer = null,
                    o.info("[SingleStreamMediaPlayer.content] Forcing reload")) : n && n()),
                    this.streamPlayer || (this.streamPlayer = new PanoptoViewer.Players.SingleStreamPlayer(e,this.containerDiv,this.videoElement,this.startPosition,(function() {
                        if (n && n(),
                        void 0 !== i.onReady && i.onReady.resolve(),
                        i.helpers.resize)
                            if (i.videoElement.videoWidth && i.videoElement.videoHeight)
                                i.helpers.resize();
                            else {
                                o.info("[SingleStreamMediaPlayer] Deferring resize until dimensions are available");
                                var e = function() {
                                    i.videoElement.videoWidth && i.videoElement.videoHeight && (i.helpers.resize(),
                                    i.videoElement.removeEventListener("progress", e))
                                };
                                i.videoElement.addEventListener("progress", e)
                            }
                        else
                            o.error("[SingleStreamMediaPlayer] this.helpers.resize() is missing")
                    }
                    )),
                    this.streamPlayer.addEventListener("play", (function() {
                        2 === i.lastSetPlayState && i.streamPlayer.pause()
                    }
                    )),
                    this.streamPlayer.setOnBufferingStateChanged(this.bufferingStateChanged),
                    this.isPrimary || (this.streamPlayer.muted = !0),
                    this.cache[e.id] = {
                        video: this.videoElement,
                        player: this.streamPlayer
                    },
                    this.isPrimary ? (this.streamPlayer.volume = this.playerVolume,
                    this.streamPlayer.muted = this.playerMuted,
                    this.streamPlayer.playbackRate = this.playerSpeed) : this.streamPlayer.muted = !0)
                }
                ,
                e.prototype.position = function(e, t) {
                    return void 0 !== e ? (this.streamPlayer && this.streamPlayer.setStreamPosition(e, t),
                    e) : this.streamPlayer ? this.streamPlayer.anticipatedStreamPosition : 0
                }
                ,
                e.prototype.setStartPosition = function(e) {
                    this.startPosition = e
                }
                ,
                e.prototype.playState = function(e) {
                    this.streamPlayer ? (this.lastSetPlayState = e,
                    e === n.Playing ? this.streamPlayer.play() : this.streamPlayer.pause()) : o.error("[SingleStreamMediaPlayer.playState] setting playstate before initialized!")
                }
                ,
                e.prototype.playSpeed = function(e) {
                    var t = this;
                    this.playerSpeed = e,
                    this.applyToPlayers((function(e) {
                        e.playbackRate = t.playerSpeed
                    }
                    ))
                }
                ,
                e.prototype.bitrate = function(e) {
                    this.streamPlayer && (this.streamPlayer.bitrateIndex = t.HlsHelpers.getHlsJsQualityLevel(this.streamPlayer.bitrateOptions.length, e))
                }
                ,
                e.prototype.volume = function(e) {
                    var t = this;
                    this.isPrimary ? (this.playerVolume = e / 100,
                    this.applyToPlayers((function(e) {
                        e.volume = t.playerVolume
                    }
                    ))) : o.error("[SingleStreamMediaPlayer] Setting volume on a secondary. Ignoring.")
                }
                ,
                e.prototype.muted = function(e) {
                    var t = this;
                    this.isPrimary ? (this.playerMuted = e,
                    this.applyToPlayers((function(e) {
                        e.muted = t.playerMuted
                    }
                    ))) : o.error("[SingleStreamMediaPlayer] Setting muted on a secondary. Ignoring.")
                }
                ,
                e.prototype.syncPlayState = function(e) {}
                ,
                e.prototype.syncTimes = function(e, t) {}
                ,
                e.prototype.setCaptionText = function(e) {}
                ,
                e.prototype.setCaptionStyles = function(e) {}
                ,
                e.prototype.showShadow = function(e) {}
                ,
                e.prototype.optimizationProvider = function() {
                    var e;
                    return (null === (e = null == this ? void 0 : this.streamPlayer) || void 0 === e ? void 0 : e.optimizationProvider) || ""
                }
                ,
                e.prototype.applyToPlayers = function(e) {
                    for (var t = 0, n = Object.keys(this.cache); t < n.length; t++) {
                        var o = n[t];
                        e(this.cache[o].player)
                    }
                }
                ,
                e
            }();
            t.SingleStreamMediaPlayer = i
        }(t.Players || (t.Players = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Players = Panopto.Viewer.Players || {},
Panopto.Viewer.PlayState = Panopto.Viewer.PlayState || {},
Panopto.Viewer.Analytics = Panopto.Viewer.Analytics || {},
Panopto.Viewer.KollectiveFP = Panopto.Viewer.KollectiveFP || {},
PanoptoLegacy.Viewer.Players.VideoJsPlayer = function(e, t, n) {
    var o, i, a, r, s, l, d, c, u, p, f, h, m = PanoptoTS.Viewer.Constants, v = Panopto.Viewer.PlayState, y = Panopto.Viewer.Analytics, P = PanoptoCore.Logging.Logger, g = t.find(".video-js")[0].id, S = 0, C = !e, w = !1, b = !1, T = !1, E = !1, V = !1, I = Panopto.Core.Browser.isSafari ? "loadeddata" : "loadedmetadata", k = 16, R = 9, D = [], L = (Panopto.Viewer.KollectiveFP,
    Panopto.Core.StringHelpers.parseQueryString(window.location.search.slice(1), !0, !0).p2poptimization,
    $("#" + (e ? "primaryBuffering" : "secondaryBuffering"))), x = function(e) {
        return e ? "loadedmetadata" : I
    }, O = function(e) {
        f && f.flushQualityReport("Flash" === o.techName && e, o.currentTime(), "Flash" === o.techName && o.level(), "Flash" === o.techName && o.numberOfLevels(), "Flash" === o.techName && D[o.level()], "Flash" === o.techName && o.autoLevelEnabled())
    }, U = function(e) {
        o.one("timeupdate", (function() {
            O(r === v.Playing)
        }
        )),
        o.currentTime(e),
        w ? (w = !1,
        S = e) : void 0 !== S && (S = e)
    }, M = function(e) {
        switch (e) {
        case v.Playing:
            o.play(),
            s && B(s),
            O(!0);
            break;
        case v.Paused:
            o.pause(),
            O(!1)
        }
        a = void 0,
        r = e
    }, A = function(e) {
        var t = 0
          , n = o.currentTime();
        if (D.length) {
            switch (e) {
            case PanoptoTS.Viewer.MBRBitrate.Auto:
                t = -1;
                break;
            case PanoptoTS.Viewer.MBRBitrate.Medium:
                t = Math.max(0, o.numberOfLevels() - 2);
                break;
            case PanoptoTS.Viewer.MBRBitrate.High:
                t = o.numberOfLevels() - 1
            }
            1 === o.numberOfLevels() && (t = -1),
            o.level(t),
            o.currentTime(n),
            O(r === v.Playing)
        }
    }, H = function() {
        return !("Flash" === o.techName && -1 !== o.currentSrc().indexOf(".m3u8"))
    }, B = function(e) {
        var t, n = o.volume(), a = o.muted();
        (c && _.some(c, (function(e) {
            return "video/mp4" == e.type
        }
        )) || H()) && (1 === (H() ? o.playbackRate() : 1) && 1 !== e ? "Flash" === o.techName && (t = [c[1]],
        o.options({
            techOrder: ["html5", "flash"]
        }),
        T = !0,
        O(!1)) : 1 === e && T && (t = c,
        o.options({
            techOrder: ["flash", "html5"]
        }),
        T = !1,
        o.one("loadedmetadata", (function() {
            l && A(l)
        }
        ))),
        t ? (i = o.currentTime(),
        o.src(t).one(x(!T), (function() {
            r === v.Playing ? o.play() : S = i,
            o.currentTime(i),
            i = void 0,
            o.volume(n),
            o.muted(a)
        }
        )).one("loadeddata", (function() {
            H() && o.playbackRate(e)
        }
        ))) : H() && o.playbackRate(e))
    }, F = function(t) {
        e && o.volume(t / PanoptoTS.Viewer.Constants.MaxVolume),
        d = void 0
    }, N = function(t) {
        (e || t) && o.muted(t),
        C = void 0
    }, z = function() {
        E = !0,
        o.play(),
        "number" == typeof S && (U(S),
        S = void 0),
        o.pause(),
        a && M(a),
        void 0 !== d && F(d),
        C && N(C),
        l && A(l)
    }, G = function() {
        var e = _.find(Panopto.Captions.ColorOptions, (function(e) {
            return e.key === u.colorSchemeKey
        }
        ))
          , t = "transparent" !== e.backgroundColor;
        o.setCaptionOptions(e.color, t ? e.backgroundColor : "#000000", u.textSize, e.overlayOpacity, t, "none" !== e.textShadow)
    }, j = function() {
        "Flash" === o.techName && (o.brandingColors(Panopto.Core.UI.Color.parse(Panopto.branding.accentColor).toHex(), Panopto.Core.UI.Color.parse(Panopto.branding.accentColor).getSafety().toHex()),
        o.localizedStrings(Panopto.GlobalResources.ViewerPlus_ExitFullScreen),
        u && G())
    }, Q = function(t, i) {
        o.off("loadeddata"),
        o.off("loadedmetadata"),
        o.one(x("Flash" === o.techName), z),
        t ? (o.options({
            techOrder: ["html5"]
        }),
        o.one("loadedmetadata", (function() {
            var e = $("#" + g).find("video")[0];
            k = e.videoWidth,
            R = e.videoHeight,
            D = [],
            n.resize()
        }
        ))) : o.on("loadedmetadata", j),
        i && o.one("loadeddata", i),
        Panopto.Core.Browser.isIE && "Html5" === o.techName && o.isFullscreen() && (o.exitFullscreen(),
        o.one("loadeddata", (function() {
            o.requestFullscreen()
        }
        )));
        c[0];
        o.src(c),
        e && p.deliveryTitle && Panopto.viewer.ooyalaProviderCode && Ooyala.Analytics.VideojsReporter(Panopto.viewer.ooyalaProviderCode, o, {
            mediaId: PanoptoTS.StringHelpers.format("{0} ({1})", p.deliveryTitle, p.id),
            contentType: Ooyala.Analytics.MediaContentType.EXTERNAL_CONTENT
        })
    }, q = function(t) {
        if (o)
            t();
        else if (!b) {
            b = !0,
            Panopto.viewer.detectFlashCrashAndFallBackToHTML && setTimeout(X, 1e3);
            videojs(g, {
                techOrder: Panopto.Core.Browser.flashEnabled() ? ["flash", "html5"] : ["html5", "flash"],
                controls: !1,
                preload: "auto",
                autoplay: !1,
                flash: {
                    swf: Panopto.viewer.swfLocation
                },
                plugins: {}
            }, (function() {
                var i, a;
                (o = videojs(g)).on("levelswitch", (function() {
                    O(r === v.Playing),
                    P.info((e ? "Primary" : "Secondary") + " player started playing segment at quality level " + o.level() + " of " + o.numberOfLevels() + " (" + D[o.level()] + ")")
                }
                )),
                o.on("ended", (function() {
                    w = !0
                }
                )),
                i = Panopto.Core.Browser.isWebkit,
                o.on("rewind", (function() {
                    n.rewind()
                }
                )).on("forward", (function() {
                    n.forward()
                }
                )).on("togglePlaying", (function() {
                    n.togglePlaying()
                }
                )).on("hotkey", (function(e, t) {
                    !V && i || n.hotkey(t)
                }
                )).on("fullscreenModeChanged", (function() {
                    V = !V,
                    n.synchronize()
                }
                )).on("waiting", (function() {
                    "Flash" === o.techName && o.toggleBuffering(!0)
                }
                )).on("canplay", (function() {
                    "Flash" === o.techName && o.toggleBuffering(!1)
                }
                )),
                a = J(),
                o.on("waiting", (function() {
                    Y(a).show()
                }
                )).on("canplay", (function() {
                    L.hide()
                }
                )).on("seeked", (function() {
                    L.hide()
                }
                )),
                t()
            }
            ))
        }
    }, W = !1, K = function() {
        W || (window.location.search += PanoptoTS.StringHelpers.format("&{0}=true", Panopto.Core.Constants.IgnoreFlashParamKey),
        W = !0)
    }, J = function() {
        L.show();
        var e = L.outerWidth(!0)
          , t = L.outerHeight(!0);
        return L.hide(),
        {
            bufferingWidth: e,
            bufferingHeight: t
        }
    }, Y = function(e) {
        var n = PanoptoTS.StringHelpers.format("#{0} video", t.attr("id"))
          , o = $(n);
        return L.css({
            top: o.offset().top + (o.height() - e.bufferingHeight) / 2,
            left: o.offset().left + (o.width() - e.bufferingWidth) / 2
        })
    }, X = function() {
        var t = $("#" + g).find("object");
        if (e && t.length)
            try {
                (!t[0]).exitFullscreen && K()
            } catch (e) {
                K()
            }
    };
    return videojs.options.flash.flashVars = {
        hls_debug: !1,
        hls_debug2: !1
    },
    {
        content: function(e, t, o) {
            c && !t && c[0].src === e.url || (p = e,
            E = !1,
            w = !1,
            O(!1),
            f = y.QualityReporter({
                streamUrl: e.url,
                isBroadcast: e.isBroadcast,
                isAudioOnly: e.isAudioOnly,
                minDuration: m.QualityReportThreshold
            }),
            c = [],
            Panopto.Core.Browser.isEdge && e.url.indexOf(".m3u8") >= 0 && e.httpUrl && (e.url = ""),
            _.each(_.filter([e.url, e.httpUrl], (function(e) {
                return e
            }
            )), (function(t) {
                var n = t.indexOf(".m3u8") >= 0
                  , o = {
                    src: t,
                    type: n ? m.HLSMimeType : m.MP4MimeType,
                    optimizationToken: void 0
                };
                n && e.optimizationToken && (o.optimizationToken = e.optimizationToken),
                _.find(c, (function(e) {
                    return e.src === t
                }
                )) || c.push(o)
            }
            )),
            _.some(c, (function(e) {
                return e.type === m.HLSMimeType
            }
            )) ? function(e, t) {
                var o = function(e) {
                    var o = new RegExp("RESOLUTION=(\\d*)x(\\d*)","i")
                      , i = new RegExp("BANDWIDTH=(\\d*)","i")
                      , a = o.exec(e);
                    a && 3 === a.length ? (k = parseFloat(a[1]),
                    R = parseFloat(a[2])) : (k = 0,
                    R = 0),
                    D.length = 0;
                    do {
                        (a = i.exec(e)) && (D.push(parseFloat(a[1])),
                        e = e.slice(a.index + a[0].length))
                    } while (a);
                    D.sort((function(e, t) {
                        return e - t
                    }
                    )),
                    t && t(),
                    n.resize()
                };
                if (!window.XDomainRequest || window.location.protocol === Panopto.Core.UrlHelpers.getProtocol(e.url) && window.location.hostname === Panopto.Core.UrlHelpers.getHost(e.url))
                    $.ajax({
                        url: e.url,
                        success: o
                    });
                else {
                    var i = new XDomainRequest;
                    i.open("get", e.url),
                    i.onload = function() {
                        o(i.responseText)
                    }
                    ,
                    i.onerror = function() {}
                    ,
                    i.onprogress = function() {}
                    ,
                    i.ontimeout = function() {}
                    ,
                    i.send()
                }
            }(e, (function() {
                q((function() {
                    Q(!1, o)
                }
                ))
            }
            )) : q((function() {
                Q(!0, o)
            }
            )))
        },
        playState: function(e) {
            E ? M(e) : a = e
        },
        position: function(e, t) {
            if (void 0 === e)
                return e = E ? i || o.currentTime() : S,
                Panopto.viewer.detectFlashCrashAndFallBackToHTML && o && "Flash" === o.techName && X(),
                e === 1 / 0 ? 0 : e;
            E ? (t && o.on("timeupdate", (function() {
                o.currentTime() !== 1 / 0 && (t(),
                o.off("timeupdate"))
            }
            )),
            U(e)) : S = e
        },
        ended: function() {
            return w
        },
        bitrate: function(e) {
            E && A(e),
            l = e
        },
        numericBitrate: function() {
            return E && "Flash" === o.techName ? D[o.level()] : 0
        },
        bitrateOptions: function() {
            return o && "Flash" === o.techName ? D : []
        },
        playSpeed: function(e) {
            E && B(e),
            s = e
        },
        volume: function(e) {
            E ? F(e) : d = e
        },
        muted: function(e) {
            E ? N(e) : C = e
        },
        width: function() {
            return k
        },
        height: function() {
            return R
        },
        showShadow: function(e) {
            o && "Flash" === o.techName && o.showShadow(e)
        },
        streamLength: function() {
            return E ? o.duration() : 0
        },
        syncPlayState: function(e) {
            o && "Flash" === o.techName && o.syncPlayState(e === v.Playing)
        },
        syncTimes: function(e, t) {
            o && "Flash" === o.techName && o.syncTimes(e, t)
        },
        isFullscreen: function(e) {
            if (void 0 === e)
                return !!E && (o.isFullscreen() || V);
            E && (e ? o.requestFullscreen() : o.exitFullscreen())
        },
        setCaptionText: function(e) {
            o && "Flash" === o.techName && o.setCaptionText(e)
        },
        optimizationProvider: function() {
            return h
        },
        setCaptionStyles: function(e) {
            u = e,
            o && "Flash" === o.techName && G()
        }
    }
}
,
function(e) {
    !function(e) {
        !function(e) {
            !function(e) {
                var t = function() {
                    function t(e) {
                        this.params = e,
                        this.isTopLevelComment = !1,
                        this.animationSpeed = void 0 !== e.animationSpeed ? e.animationSpeed : "fast",
                        this.setEventData(e.commentEvent)
                    }
                    return t.prototype.setAsTopLevelComment = function(e) {
                        this.isTopLevelComment = e
                    }
                    ,
                    t.prototype.isForEvent = function(t) {
                        return e.DiscussionUtils.eventsMatchById(this, t)
                    }
                    ,
                    t.prototype.updateEvent = function(e) {
                        this.eventDataChanged(e) && (this.setEventData(e),
                        this.render(this.element, !0))
                    }
                    ,
                    t.prototype.eventDataChanged = function(e) {
                        return this.id !== e.id || this.eventId !== e.eventId || this.text !== e.text || this.editable !== e.editable || this.deletable !== e.deletable
                    }
                    ,
                    t.prototype.setEventData = function(t) {
                        this.commentEvent = _.clone(t),
                        this.userDisplayName = t.userDisplayName,
                        this.creationTimeInMillis = t.creationTime,
                        this.sessionTime = e.DiscussionUtils.roundSessionTime(t.time),
                        this.text = t.text,
                        this.id = t.id,
                        this.eventId = t.eventId,
                        this.editable = t.editable,
                        this.deletable = t.deletable,
                        this.replyable = t.replyable;
                        var n = this.params.panoptoGlobal.Core.TimeHelpers.toLocalPanoptoTime(this.params.panoptoGlobal.Core.TimeHelpers.formatWin32EpochTimeToDate(this.creationTimeInMillis), this.params.panoptoGlobal.timeZone)
                          , o = this.params.panoptoGlobal.GlobalResources.ViewerPlus_CommentTimestamp;
                        this.commentTimestamp = o.format(this.params.panoptoGlobal.Util.displayDate(n, {
                            format: "friendly",
                            local: !0
                        }), this.params.panoptoGlobal.Util.displayDate(n, {
                            format: "time",
                            local: !0
                        })),
                        this.creationDateString = this.params.panoptoGlobal.Util.displayDate(n, {
                            format: "long",
                            local: !0
                        }),
                        this.sessionTimestampString = this.params.panoptoGlobal.Core.TimeHelpers.formatDuration(this.sessionTime, this.params.panoptoGlobal.GlobalResources.TimeSeparator)
                    }
                    ,
                    t.prototype.render = function(e, n) {
                        var o = this;
                        void 0 === n && (n = !1);
                        var i = $(t.template({
                            comment: this,
                            resx: this.params.panoptoGlobal.GlobalResources
                        }));
                        if (i.keydown((function(e) {
                            return o.params.handleKeys(e)
                        }
                        )),
                        i.mousedown((function() {
                            return i.addClass("clicked")
                        }
                        )),
                        i.blur((function() {
                            return i.removeClass("clicked")
                        }
                        )),
                        this.replyable) {
                            var a = i.find(".reply-link");
                            a.show(),
                            this.params.panoptoGlobal.Core.UI.Handlers.button(a, (function() {
                                o.params.replyCallback(o.commentEvent)
                            }
                            ))
                        }
                        if (this.editable) {
                            var r = i.find(".edit-link");
                            r.show(),
                            this.params.panoptoGlobal.Core.UI.Handlers.button(r, (function() {
                                o.params.editClickedCallback(o.commentEvent)
                            }
                            ))
                        }
                        if (this.deletable) {
                            var s = i.find(".delete-link");
                            s.show(),
                            this.params.panoptoGlobal.Core.UI.Handlers.button(s, (function() {
                                o.params.deleteClickedCallback(o.commentEvent)
                            }
                            ))
                        }
                        this.isTopLevelComment && this.params.panoptoGlobal.Core.UI.Handlers.button(i, (function() {
                            o.params.eventClickedCallback(o.commentEvent)
                        }
                        )),
                        n ? e.replaceWith(i) : e.append(i),
                        this.element = i
                    }
                    ,
                    t.prototype.remove = function() {
                        var e = this;
                        this.element.slideUp(this.animationSpeed, (function() {
                            e.element.remove()
                        }
                        ))
                    }
                    ,
                    t.template = _.template('\n<li class="comment-block"\n    id="<@= comment.id @>"\n    tabindex="0">\n    <div class="comment-header">\n        <span class="username"><@- comment.userDisplayName @></span>\n        <@ if (comment.isTopLevelComment) { @>\n            <span class="session-time">\n                <@= comment.sessionTimestampString @>\n            </span>\n        <@ } @>\n    </div>\n    <div class="comment-body" dir="auto">\n        <@- comment.text @>\n    </div>\n    <div class="comment-footer">\n        <span class="comment-time" title="<@= comment.creationDateString @>">\n            <@= comment.commentTimestamp @>\n        </span>\n        <a class="reply-link"\n            href="#"\n            aria-label="<@- comment.replyToString @>"\n            style="display: none">\x3c!--\n            --\x3e<@- resx.ViewerPlus_Reply @>\x3c!--\n        --\x3e</a>\n        <a class="edit-link"\n            href="#"\n            aria-label="<@= comment.ViewerPlus_Discussion_EditCommentArialabel @>"\n            style="display: none">\x3c!--\n            --\x3e<@- resx.ViewerPlus_EventEdit @>\x3c!--\n        --\x3e</a>\n        <a class="delete-link"\n            href="#"\n            aria-label="<@= comment.ViewerPlus_Discussion_DeleteCommentArialabel @>"\n            style="display: none">\x3c!--\n            --\x3e<@- resx.ViewerPlus_EventDelete @>\x3c!--\n        --\x3e</a>\n    </div>\n</li>\n        '),
                    t
                }();
                e.CommentViewModel = t
            }(e.Discussion || (e.Discussion = {}))
        }(e.Tabs || (e.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            !function(e) {
                var t = function() {
                    function t(e) {
                        var t = this;
                        this.params = e,
                        this.handleKeys = function(e) {
                            var n = $(e.target)
                              , o = !0;
                            switch (e.which) {
                            case t.params.panoptoGlobal.Core.Key.UpArrow:
                                t.focusPrevComment(n);
                                break;
                            case t.params.panoptoGlobal.Core.Key.DownArrow:
                                t.focusNextComment(n);
                                break;
                            case t.params.panoptoGlobal.Core.Key.LeftArrow:
                                t.findTopLevelComment(n).collapseComments();
                                break;
                            case t.params.panoptoGlobal.Core.Key.RightArrow:
                                t.findTopLevelComment(n).expandComments();
                                break;
                            default:
                                o = !1
                            }
                            o && (e.preventDefault(),
                            e.stopPropagation())
                        }
                        ,
                        this.target = e.target,
                        this.events = e.events.slice(0),
                        this.animationSpeed = void 0 !== e.animationSpeed ? e.animationSpeed : "fast",
                        this.groupedComments = this.transformEventsToGroupedModel(e.events)
                    }
                    return t.prototype.render = function() {
                        this.container = $(t.template({
                            resx: this.params.panoptoGlobal.GlobalResources
                        }));
                        for (var e = 0, n = this.groupedCommentsToSortedArray(this.groupedComments); e < n.length; e++) {
                            n[e].render(this.container)
                        }
                        this.target.append(this.container),
                        $("#commentsTabPane").find(".event-input").hide()
                    }
                    ,
                    t.prototype.syncComments = function(t, n) {
                        var o = this;
                        if (void 0 === n && (n = !1),
                        n) {
                            var i = _.filter(this.events, (function(n) {
                                return !_.find(t, (function(t) {
                                    return e.DiscussionUtils.eventsMatchById(n, t)
                                }
                                ))
                            }
                            ));
                            _.each(i, (function(e) {
                                o.removeComment(e)
                            }
                            ))
                        }
                        _.each(t, (function(e) {
                            o.addComment(e)
                        }
                        )),
                        this.events = t.slice(0)
                    }
                    ,
                    t.prototype.addComment = function(t) {
                        var n = e.DiscussionUtils.roundSessionTime(t.time)
                          , o = this.groupedComments[n];
                        o ? o.addComment(t) : this.addNewThread([t])
                    }
                    ,
                    t.prototype.addNewThread = function(t) {
                        var n = new e.ThreadViewModel({
                            commentEvents: t,
                            animationSpeed: this.animationSpeed,
                            handleKeys: this.handleKeys,
                            eventClickedCallback: this.params.eventClickedCallback,
                            editClickedCallback: this.params.editClickedCallback,
                            deleteClickedCallback: this.params.deleteClickedCallback,
                            submitNewEventCallback: this.params.submitNewEventCallback,
                            panoptoGlobal: this.params.panoptoGlobal
                        });
                        n.render(this.container),
                        this.groupedComments[n.comment.sessionTime] = n
                    }
                    ,
                    t.prototype.removeComment = function(t) {
                        this.container.find("#" + t.id);
                        var n = e.DiscussionUtils.roundSessionTime(t.time)
                          , o = this.groupedComments[n];
                        o.removeComment(t) && delete o[t.time.toFixed(2)]
                    }
                    ,
                    t.prototype.scrollCommentIntoView = function(t) {
                        var n = e.DiscussionUtils.roundSessionTime(t.time)
                          , o = this.groupedComments[n];
                        if (o) {
                            o.expandComments(0);
                            var i = this.container.find("#" + t.id);
                            i.length > 0 && (i[0].scrollIntoView(),
                            i.addClass("highlight-comment"),
                            i.animate({
                                backgroundColor: "transparent"
                            }, "slow"))
                        }
                    }
                    ,
                    t.prototype.transformEventsToGroupedModel = function(t) {
                        var n = this
                          , o = _.groupBy(t, (function(t) {
                            return e.DiscussionUtils.roundSessionTime(t.time)
                        }
                        ))
                          , i = {};
                        return Object.keys(o).forEach((function(t) {
                            o[t] = _.sortBy(o[t], (function(e) {
                                return e.creationTime
                            }
                            ));
                            var a = new e.ThreadViewModel({
                                commentEvents: o[t],
                                animationSpeed: n.animationSpeed,
                                handleKeys: n.handleKeys,
                                eventClickedCallback: n.params.eventClickedCallback,
                                editClickedCallback: n.params.editClickedCallback,
                                deleteClickedCallback: n.params.deleteClickedCallback,
                                submitNewEventCallback: n.params.submitNewEventCallback,
                                panoptoGlobal: n.params.panoptoGlobal
                            });
                            i[t] = a
                        }
                        )),
                        i
                    }
                    ,
                    t.prototype.groupedCommentsToSortedArray = function(e) {
                        var t = _.values(e);
                        return t = _.sortBy(t, (function(e) {
                            return e.comment.creationTimeInMillis
                        }
                        ))
                    }
                    ,
                    t.prototype.focusNextComment = function(e) {
                        var t = $(".threaded-discussion").find(".comment-block:visible")
                          , n = t.index(e);
                        n + 1 < t.length && t[n + 1].focus()
                    }
                    ,
                    t.prototype.focusPrevComment = function(e) {
                        var t = $(".threaded-discussion").find(".comment-block:visible")
                          , n = t.index(e);
                        n > 0 && t[n - 1].focus()
                    }
                    ,
                    t.prototype.findTopLevelComment = function(e) {
                        var t = e.closest(".thread-wrapper").attr("data-timestamp");
                        return this.groupedComments[t]
                    }
                    ,
                    t.template = _.template("\n        <ul\n            class='threaded-discussion'\n            aria-label=\"<@- resx.ViewerPlus_Discussion_OuterListArialabel @>\">\n        </ul>\n        "),
                    t
                }();
                e.Discussion = t
            }(e.Discussion || (e.Discussion = {}))
        }(e.Tabs || (e.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            !function(e) {
                var t = function() {
                    function e(e) {
                        this.params = e
                    }
                    return e.prototype.render = function() {
                        var t = this;
                        $(".discussion-input-wrapper").remove(),
                        this.element = $(e.template({
                            resx: this.params.panoptoGlobal.GlobalResources
                        }));
                        var n = this.element.find(".discussion-textarea");
                        n.on("paste input", (function() {
                            t.resizeInput(n)
                        }
                        )),
                        n.keydown((function(e) {
                            if (!e.ctrlKey || e.keyCode !== Panopto.Core.Key.UpArrow)
                                if (e.stopPropagation(),
                                e.keyCode !== Panopto.Core.Key.Enter || e.shiftKey)
                                    e.keyCode === Panopto.Core.Key.Esc && t.remove();
                                else {
                                    var o = jQuery.trim(n.val());
                                    o && (t.params.onSubmit(o, t.params.event.time),
                                    t.remove())
                                }
                        }
                        )),
                        this.params.panoptoGlobal.Core.UI.Handlers.button(this.element.find(".cancel-link"), (function() {
                            t.remove()
                        }
                        )),
                        this.params.target.append(this.element),
                        n.focus(),
                        n[0].scrollIntoView()
                    }
                    ,
                    e.prototype.resizeInput = function(e) {
                        var t = e.innerHeight() - e.height();
                        e.height(1);
                        var n = e[0].scrollHeight - t;
                        e.height(n)
                    }
                    ,
                    e.prototype.remove = function() {
                        this.element.remove()
                    }
                    ,
                    e.template = _.template('\n        <div class="discussion-input-wrapper">\n            <textarea class="discussion-textarea"></textarea>\n            <a href="#" class="cancel-link">\n                <@- resx.ViewerPlus_EventTab_Cancel @>\n            </a>\n        </div>\n        '),
                    e
                }();
                e.DiscussionInputControl = t
            }(e.Discussion || (e.Discussion = {}))
        }(e.Tabs || (e.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            !function(e) {
                var t = function() {
                    function e() {}
                    return e.eventsMatchById = function(e, t) {
                        var n = !1;
                        return (e.id || t.id) && e.id === t.id && (n = !0),
                        (e.eventId || t.eventId) && e.eventId === t.eventId && (n = !0),
                        n
                    }
                    ,
                    e.roundSessionTime = function(e) {
                        return +e.toFixed(2)
                    }
                    ,
                    e
                }();
                e.DiscussionUtils = t
            }(e.Discussion || (e.Discussion = {}))
        }(e.Tabs || (e.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            !function(e) {
                var t = function() {
                    function t(t) {
                        var n = this;
                        this.params = t,
                        this.replyClickedCallback = function(t) {
                            new e.DiscussionInputControl({
                                event: t,
                                target: n.element,
                                onSubmit: n.params.submitNewEventCallback,
                                panoptoGlobal: n.params.panoptoGlobal
                            }).render()
                        }
                        ,
                        this.animationSpeed = void 0 !== t.animationSpeed ? t.animationSpeed : "fast";
                        var o = _.map(t.commentEvents, (function(t) {
                            return new e.CommentViewModel({
                                animationSpeed: n.animationSpeed,
                                commentEvent: t,
                                replyCallback: n.replyClickedCallback,
                                handleKeys: n.params.handleKeys,
                                eventClickedCallback: n.params.eventClickedCallback,
                                editClickedCallback: n.params.editClickedCallback,
                                deleteClickedCallback: n.params.deleteClickedCallback,
                                panoptoGlobal: n.params.panoptoGlobal
                            })
                        }
                        ));
                        this.comment = o[0],
                        this.nestedComments = [],
                        o.length > 1 && (this.nestedComments = o.slice(1, o.length),
                        this.nestedComments = _.sortBy(this.nestedComments, "creationTimeInMillis"))
                    }
                    return t.prototype.render = function(e, n) {
                        void 0 === n && (n = !1);
                        var o = $(t.template({
                            sessionTime: this.comment.sessionTime,
                            resx: this.params.panoptoGlobal.GlobalResources
                        }));
                        this.comment.setAsTopLevelComment(!0),
                        this.comment.render(o.find(".top-level-comment"));
                        var i = this.params.panoptoGlobal.Core.StringHelpers.format(this.params.panoptoGlobal.GlobalResources.ViewerPlus_Discussion_ReplyCountArialabel, this.nestedComments.length)
                          , a = t.screenreaderOnlyReplyCountTemplate({
                            replyString: i
                        });
                        o.find(".top-level-comment .comment-block").append(a);
                        var r = o.find(".threaded-comments");
                        _.each(this.nestedComments, (function(e) {
                            e.render(r)
                        }
                        )),
                        o.find(".reply-expander").toggle(this.nestedComments.length > 0),
                        this.attachToggleHandlers(o),
                        n ? e.replaceWith(o) : e.append(o),
                        this.element = o,
                        this.updateReplyCountString()
                    }
                    ,
                    t.prototype.addComment = function(t) {
                        if (this.comment.isForEvent(t))
                            this.comment.updateEvent(t);
                        else {
                            var n = _.find(this.nestedComments, (function(e) {
                                return e.isForEvent(t)
                            }
                            ));
                            if (n)
                                n.updateEvent(t);
                            else {
                                var o = new e.CommentViewModel({
                                    animationSpeed: this.animationSpeed,
                                    commentEvent: t,
                                    replyCallback: this.replyClickedCallback,
                                    handleKeys: this.params.handleKeys,
                                    eventClickedCallback: this.params.eventClickedCallback,
                                    editClickedCallback: this.params.editClickedCallback,
                                    deleteClickedCallback: this.params.deleteClickedCallback,
                                    panoptoGlobal: this.params.panoptoGlobal
                                })
                                  , i = this.element.find(".threaded-comments");
                                o.render(i),
                                this.nestedComments.push(o),
                                this.updateReplyCountString(),
                                this.element.find(".reply-expander").show()
                            }
                        }
                    }
                    ,
                    t.prototype.removeComment = function(e) {
                        var t = this
                          , n = !1;
                        return this.comment.isForEvent(e) ? this.nestedComments.length > 0 ? (this.comment = this.nestedComments[0],
                        this.nestedComments.length > 1 ? this.nestedComments = this.nestedComments.slice(1, this.nestedComments.length) : this.nestedComments = [],
                        this.render(this.element, !0)) : (this.element.slideUp(this.animationSpeed, (function() {
                            t.element.remove()
                        }
                        )),
                        n = !0) : this.removeChildComment(e),
                        n
                    }
                    ,
                    t.prototype.removeChildComment = function(e) {
                        var t = _.findIndex(this.nestedComments, (function(t) {
                            return t.isForEvent(e)
                        }
                        ));
                        void 0 !== t && (this.nestedComments[t].remove(),
                        this.nestedComments.splice(t, 1),
                        0 === this.nestedComments.length && this.element.find(".reply-expander").hide(),
                        this.updateReplyCountString())
                    }
                    ,
                    t.prototype.remove = function() {
                        var e = this;
                        this.element.slideUp(this.animationSpeed, (function() {
                            e.element.remove()
                        }
                        ))
                    }
                    ,
                    t.prototype.expandComments = function(e) {
                        var t = void 0 !== e ? e : this.animationSpeed;
                        this.nestedComments.length > 0 && !this.element.find(".threaded-comments").is(":visible") && (this.setToggleText(this.element, !0),
                        this.element.find(".threaded-comments").slideToggle(t))
                    }
                    ,
                    t.prototype.collapseComments = function() {
                        this.nestedComments.length > 0 && this.element.find(".threaded-comments").is(":visible") && (this.setToggleText(this.element, !1),
                        this.element.find(".threaded-comments").slideToggle("fast"),
                        this.element.find(".top-level-comment .comment-block").focus())
                    }
                    ,
                    t.prototype.updateReplyCountString = function() {
                        var e = this.params.panoptoGlobal.Core.StringHelpers.format(this.params.panoptoGlobal.GlobalResources.ViewerPlus_ViewReplies, this.nestedComments.length);
                        this.element.find(".expand-replies").text(e)
                    }
                    ,
                    t.prototype.attachToggleHandlers = function(e) {
                        var t = this;
                        this.params.panoptoGlobal.Core.UI.Handlers.button(e.find(".expandable"), (function() {
                            e.find(".threaded-comments").slideToggle("fast", (function() {
                                var n = e.find(".threaded-comments").is(":visible");
                                t.setToggleText(e, n),
                                (n ? e.find(".hide-replies") : e.find(".expand-replies")).focus()
                            }
                            ))
                        }
                        ));
                        var n = this.nestedComments.length > 2;
                        n && e.find(".threaded-comments").hide(),
                        this.setToggleText(e, !n)
                    }
                    ,
                    t.prototype.setToggleText = function(e, t) {
                        e.find(".expand-replies").toggleClass("hidden", t),
                        e.find(".hide-replies").toggleClass("hidden", !t)
                    }
                    ,
                    t.template = _.template('\n        <li class="thread-wrapper" data-timestamp="<@= sessionTime @>">\n            <ul class="top-level-comment"></ul>\n            <div class="reply-expander">\n                <a href="#" class="expand-replies expandable right-arrow">\n                </a>\n                <a href="#" class="hide-replies expandable down-arrow">\n                    <@- resx.ViewerPlus_HideReplies @>\n                </a>\n                <ul class="threaded-comments">\n                </ul>\n            </div>\n        </li>\n        '),
                    t.screenreaderOnlyReplyCountTemplate = _.template('\n        <span class="screenreader">\n            <@= replyString @>\n        </span>\n        '),
                    t
                }();
                e.ThreadViewModel = t
            }(e.Discussion || (e.Discussion = {}))
        }(e.Tabs || (e.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.Editor = Panopto.Viewer.Tabs.Editor || {},
Panopto.viewer = Panopto.viewer || {},
PanoptoLegacy.Viewer.Tabs.Editor.EditContentsTab = function(e, t, n, o, i, a, r, s) {
    var l = PanoptoLegacy.Viewer.Tabs.Editor.EditTOCEventTab(e, t, n, Panopto.Viewer.Analytics.EditContents, o, r, [Panopto.Core.EventType.Label, Panopto.Core.EventType.SlideChange, Panopto.Core.EventType.SmartOcrToc, Panopto.Core.EventType.CandidateSmartOcrToc], Panopto.GlobalResources.ViewerPlus_Edit_AddTOC, s)
      , d = Panopto.Core.Extensions.base(l)
      , c = t.find(".event-input")
      , u = t.find("#quizInputOption")
      , p = t.find("#youtubeInputOption")
      , f = $("#urlInputOption")
      , h = new PanoptoTS.Viewer.Controls.OrderedContainer;
    l.$eventList.append(h.element);
    var m, v = {}, y = {}, P = {}, g = function() {
        return $.trim(c.val())
    };
    a.eventAdded.add((function(e) {
        var t = void 0 !== e.link && -1 !== e.link.indexOf(PanoptoViewer.Constants.YouTubeEmbedBaseUrl);
        e.type !== Panopto.Core.EventType.Label || t || l.openEditDialog(e)
    }
    )),
    l.addEvent = function(e) {
        d.addEvent(e, Panopto.Core.EventType.Label, {
            preferSecondary: !0
        })
    }
    ,
    l.position = function(e) {
        u.add(p).toggleClass(Panopto.Core.Constants.DisabledClass, !a.isValidTimeForEmbeddedEvent(e)),
        f.toggleClass(Panopto.Core.Constants.DisabledClass, !a.isValidTimeForEvent(e)),
        d.position(e)
    }
    ,
    l.filterForRender = function() {
        var e = d.filterForRender();
        return _.filter(e, (function(e) {
            return e.type !== Panopto.Core.EventType.CandidateSmartOcrToc
        }
        ))
    }
    ,
    l.render = function() {
        var e = o.activeState();
        S(e.sessionReferences),
        E(l.filterForRender()),
        I(e.questionLists())
    }
    ,
    l.openEditDialog = function(e) {
        d.openEditDialog(_.find(l.events(), (function(t) {
            return t.id === e.id
        }
        )))
    }
    ;
    var S = function(e) {
        _.each(e, (function(e) {
            v.hasOwnProperty(e.id) || (v[e.id] = w());
            var t = v[e.id];
            t.render(e),
            h.insert(t.element, e.editorStartTime / Panopto.Core.Constants.TimelineChunkMultiplier)
        }
        )),
        _.each(Object.keys(v), (function(t) {
            _.some(e, (function(e) {
                return e.id === t
            }
            )) || (h.remove(v[t].element),
            delete v[t])
        }
        ))
    }
      , C = function(e, t) {
        var n = 0
          , o = []
          , i = []
          , a = {};
        return t.filter((function(t) {
            return t.start === e.start
        }
        )).sort((function(e, t) {
            return e.order - t.order
        }
        )).forEach((function(e) {
            if (e.order !== n) {
                o.push(e);
                var t = e.copy(!0, {
                    order: n
                });
                i.push(t),
                a[e.id] = t.id
            }
            n++
        }
        )),
        {
            sessionReferencesToRemove: o,
            sessionReferencesToAdd: i,
            oldToNewIDMap: a
        }
    }
      , w = function() {
        var e = new PanoptoTS.Viewer.Tabs.Editor.SessionReferenceRow;
        return e.seekCallbacks.add((function(e) {
            n.setPosition(e.editorStartTime / Panopto.Core.Constants.TimelineChunkMultiplier)
        }
        )),
        e.editCallbacks.add((function(e) {
            T(e)
        }
        )),
        e.deleteCallbacks.add((function(e) {
            var t = r.toWin32EpochRelative(n.getPosition());
            o.pushEdit();
            var i = o.activeState().sessionReferences
              , a = _.findIndex(i, (function(t) {
                return t.id === e.id
            }
            ));
            if (-1 !== a) {
                i.splice(a, 1);
                var s = _.filter(o.activeState().cuts(), (function(t) {
                    return t.targetId === e.id
                }
                ));
                _.each(s, (function(e) {
                    o.activeState().cuts().splice(o.activeState().cuts().indexOf(e), 1)
                }
                ));
                var l = C(e, i)
                  , d = l.sessionReferencesToRemove
                  , c = l.sessionReferencesToAdd;
                d.forEach((function(e) {
                    i.splice(i.indexOf(e), 1)
                }
                )),
                i.push.apply(i, c)
            }
            o.activeState().refreshTimeline(),
            o.applyState(),
            n.setPosition(o.activeState().calculateEditorTimeFromAbsolute(t.ticks()))
        }
        )),
        e.eventSeekCallbacks.add((function(e) {
            n.setPosition(e.editorTime)
        }
        )),
        e.hoverCallbacks.add((function(e) {
            var t = e.sessionReference
              , n = e.hoverEventType
              , i = !1
              , a = !1;
            o.activeState().sessionReferences.filter((function(e) {
                return e.start === t.start
            }
            )).map((function(e) {
                return e.order < t.order ? i = !0 : e.order > t.order && (a = !0),
                v[e.id]
            }
            )).forEach((function(e) {
                e.handleHoverOutline(n)
            }
            )),
            n === PanoptoCore.HoverEventType.HoverIn && v[t.id].displayOrderArrows(i, a),
            o.highlightEventView(t, n === PanoptoCore.HoverEventType.HoverIn)
        }
        )),
        e.orderChangeCallbacks.add((function(e) {
            var t = e.sessionReference
              , n = e.orderChangeType === PanoptoCore.OrderChangeType.OrderUp ? t.order - 1 : t.order + 1
              , o = t.copy(!0, {
                order: n
            });
            b(t, o, !0)
        }
        )),
        e
    }
      , b = function(e, t, n) {
        var i;
        void 0 === n && (n = !1),
        o.pushEdit();
        for (var a, r = o.activeState().sessionReferences, s = _.findIndex(r, (function(t) {
            return t.id === e.id
        }
        )), l = o.getViewerPosition().ticks(), d = l, c = 0, u = r; c < u.length; c++) {
            if ((M = u[c]).editorStartTime < l) {
                if (M.editorStartTime + M.getTimelineDuration() > l) {
                    a = M.id,
                    d = l - M.editorStartTime;
                    break
                }
                d -= M.getTimelineDuration()
            }
        }
        if (-1 !== s) {
            t || (t = m.createModifiedContent());
            var p = t.order
              , f = t.start;
            if (t.start == -1 / 0)
                f = 0;
            else if (t.start == 1 / 0)
                f = o.activeState().hostDuration();
            else if (!n) {
                for (var h = !1, v = 0, y = 0, P = r; y < P.length; y++) {
                    var g = (M = P[y]).editorStartTime;
                    if (g < t.start) {
                        var S = M.getTimelineDuration();
                        if (v += S,
                        g + S >= t.start) {
                            f = M.start,
                            h = !0,
                            p = t.start - g < g + S - t.start ? M.order : M.order + 1,
                            e.start === M.start && e.order < p && p--;
                            break
                        }
                    }
                }
                h || (f = t.start - v)
            }
            r.splice(s, 1);
            var w = C(e, r)
              , b = w.sessionReferencesToRemove
              , T = w.sessionReferencesToAdd
              , E = w.oldToNewIDMap;
            b.forEach((function(e) {
                r.splice(r.indexOf(e), 1)
            }
            )),
            r.push.apply(r, T),
            a = null !== (i = E[a]) && void 0 !== i ? i : a;
            var V = r.filter((function(e) {
                return !!PanoptoCore.Helpers.timesAreApproxEqual(e.start, f) && (e.start !== f && (f = e.start),
                !0)
            }
            )).length
              , I = PanoptoCore.Extensions.MathExtensions.clamp(p, 0, V)
              , k = r.map((function(e) {
                if (e.start === f) {
                    if (e.order >= I) {
                        var t = e.copy(!0, {
                            order: e.order + 1
                        });
                        return e.id === a && (a = t.id),
                        t
                    }
                    return e
                }
                return e
            }
            ))
              , R = t.copy(!0, {
                start: f,
                order: I
            });
            a === e.id && (a = R.id),
            k.push(R),
            r.length = 0,
            r.push.apply(r, k),
            o.activeState().refreshTimeline(),
            o.applyState();
            var D = d;
            if (a)
                for (var L = 0, x = r; L < x.length; L++) {
                    if ((M = x[L]).id === a) {
                        D += M.editorStartTime;
                        break
                    }
                }
            else
                for (var O = 0, U = r; O < U.length; O++) {
                    var M;
                    (M = U[O]).start < d && (D += M.getTimelineDuration())
                }
            o.setViewerPosition(D / Panopto.Core.Constants.TimelineChunkMultiplier)
        }
    };
    l.handleSessionReferenceEdit = b;
    l.handleSessionReferenceHighlight = function(e, t) {
        v[e.id].handleHoverHighlight(t)
    }
    ;
    var T = function(e) {
        var t = o.activeState().duration();
        (m = new PanoptoTS.Viewer.Dialogs.SessionReferenceEditorDialog(0,t,Panopto.GlobalResources,Panopto.ModalPopup.defaultInstance)).saveCallbacks.add((function() {
            return b(e)
        }
        )),
        n.toggleScreens(!1),
        m.showDialog(e)
    }
      , E = function(e) {
        _.each(e, (function(e) {
            y.hasOwnProperty(e.id) || (y[e.id] = V());
            var t = y[e.id];
            t.render(e),
            h.insert(t.element, e.editorTime)
        }
        )),
        _.each(Object.keys(y), (function(t) {
            _.some(e, (function(e) {
                return e.id === t
            }
            )) || (h.remove(y[t].element),
            delete y[t])
        }
        ))
    }
      , V = function() {
        var e = new PanoptoTS.Viewer.Tabs.Editor.EditableEventRow;
        return e.seekCallbacks.add((function(e) {
            n.setPosition(e.editorTime)
        }
        )),
        e.editCallbacks.add((function(e) {
            l.openEditDialog(e)
        }
        )),
        e.changedCallbacks.add((function(e) {
            o.pushEdit();
            var t = _.find(o.activeState().events(), (function(t) {
                return e.event.id === t.id
            }
            ));
            t.name = e.name,
            t.edited = !0,
            o.activeState().refreshTimeline(),
            o.applyState()
        }
        )),
        e.deleteCallbacks.add((function(e) {
            o.pushEdit();
            var t = l.events()
              , n = _.find(t, (function(t) {
                return e.id === t.id
            }
            ));
            t.splice(t.indexOf(n), 1),
            o.applyState()
        }
        )),
        e
    }
      , I = function(e) {
        _.each(e, (function(e) {
            P.hasOwnProperty(e.id) || (P[e.id] = k());
            var t = P[e.id]
              , n = r.toUneditedFirstPrimaryRelative(e.firstStreamRelativeTicks);
            t.render({
                id: e.id,
                name: e.name,
                editorTime: n.seconds()
            }, {
                isQuestionList: !0
            }),
            h.insert(t.element, n.seconds())
        }
        )),
        _.each(Object.keys(P), (function(t) {
            _.some(e, (function(e) {
                return e.id === t
            }
            )) || (h.remove(P[t].element),
            delete P[t])
        }
        ))
    }
      , k = function() {
        var e = new PanoptoTS.Viewer.Tabs.Editor.EditableEventRow;
        return e.seekCallbacks.add((function(e) {
            n.setPosition(e.editorTime)
        }
        )),
        e.changedCallbacks.add((function(e) {
            o.pushEdit();
            var t = _.find(o.activeState().questionLists(), (function(t) {
                return e.event.id === t.id
            }
            ));
            t.name = e.name,
            t.isEdited = !0,
            o.activeState().refreshTimeline(),
            o.applyState()
        }
        )),
        e.deleteCallbacks.add((function(e) {
            o.removeQuestionList(e)
        }
        )),
        e
    };
    i && (Panopto.Core.UI.Handlers.button(u, (function() {
        var e = l.startTime();
        void 0 === e && (e = n.position()),
        a.isValidTimeForEmbeddedEvent(e) && (o.addQuestionList(g()),
        l.clearInput())
    }
    )),
    u.show()),
    Panopto.features.disableFeaturesRequiringExternalNetworkAccess && p.hide(),
    Panopto.Core.UI.Handlers.button(p, (function() {
        var e = g() || Panopto.GlobalResources.ViewerPlus_Edit_YouTubeDefaultName
          , t = l.startTime();
        void 0 === t && (t = n.position()),
        a.isValidTimeForEmbeddedEvent(t) && (a.addYouTubeEvent(e, t),
        l.clearInput())
    }
    )),
    Panopto.Core.UI.Handlers.button(f, (function() {
        var e = g() || Panopto.GlobalResources.ViewerPlus_Edit_UrlEventDefaultName
          , t = l.startTime();
        void 0 === t && (t = n.position()),
        a.isValidTimeForEvent(t) && (a.addUrlEvent(e, t),
        l.clearInput())
    }
    ));
    var R = $("#reactSmartChapterControls")
      , D = PanoptoReactComponents.bootstrapReactComponent(PanoptoReactComponents.Control.SmartChapterControls)(R, {
        toggleEnabled: !0,
        resources: Panopto.GlobalResources,
        statusText: "",
        onToggle: function(e) {
            return L(e)
        },
        onProcessingKickoff: function() {
            return x()
        }
    })
      , L = function(e) {
        D.setProps({
            toggleState: e
        }),
        U(e ? Panopto.GlobalResources.ViewerPlus_Edit_SmartChapters_Hide : Panopto.GlobalResources.ViewerPlus_Edit_SmartChapters_Show),
        o.pushEdit();
        var t = o.activeState().events().filter((function(t) {
            return e ? t.type === Panopto.Core.EventType.CandidateSmartOcrToc : t.type === Panopto.Core.EventType.SmartOcrToc
        }
        ))
          , n = t.map((function(t) {
            var n = t.copy();
            return n.id = _.uniqueId("event"),
            n.name = t.name.substring(0, PanoptoTS.Viewer.Constants.TOCMaxLength),
            n.type = e ? Panopto.Core.EventType.SmartOcrToc : Panopto.Core.EventType.CandidateSmartOcrToc,
            n
        }
        ));
        t.forEach((function(e) {
            var t = l.events().indexOf(e);
            -1 !== t && l.events().splice(t, 1)
        }
        )),
        n.forEach((function(e) {
            l.events().push(e)
        }
        )),
        o.activeState().refreshTimeline(),
        o.applyState()
    }
      , x = function() {
        U(Panopto.GlobalResources.ViewerPlus_Edit_SmartChapters_Processing),
        O.requestSmartChapters(o.session().id, (function(e) {
            return A()
        }
        ), H)
    }
      , O = new PanoptoTS.API.Rest.SessionService(Panopto.Core.ServiceInterface.Rest.Api)
      , U = function(e, t) {
        D.setProps({
            statusText: e
        })
    }
      , M = function() {
        D.setProps({
            displayState: PanoptoReactComponents.Control.DisplayState.Available
        }),
        o.activeState().filterEvents(Panopto.Core.EventType.SmartOcrToc).length > 0 ? (D.setProps({
            toggleState: !0
        }),
        U(Panopto.GlobalResources.ViewerPlus_Edit_SmartChapters_Hide)) : o.activeState().filterEvents(Panopto.Core.EventType.CandidateSmartOcrToc).length > 0 ? (D.setProps({
            toggleState: !1
        }),
        U(Panopto.GlobalResources.ViewerPlus_Edit_SmartChapters_Show)) : H()
    }
      , A = function() {
        U(Panopto.GlobalResources.ViewerPlus_Edit_SmartChapters_Processing),
        D.setProps({
            displayState: PanoptoReactComponents.Control.DisplayState.Processing
        }),
        window.setTimeout((function() {
            O.getSmartChaptersState(o.session().id, (function(e) {
                return B(e.state)
            }
            ), H, (function() {
                return null
            }
            ))
        }
        ), 5e3)
    }
      , H = function() {
        D.setProps({
            displayState: PanoptoReactComponents.Control.DisplayState.Error
        }),
        U(Panopto.GlobalResources.ViewerPlus_Edit_SmartChapters_Error)
    }
      , B = function(e) {
        e === AutoInternal.SmartChaptersState.NotProcessed && !0 !== Panopto.viewer.isSmartChapteringEnabled || (R.show(),
        e === AutoInternal.SmartChaptersState.NoSmartChapters ? (D.setProps({
            displayState: PanoptoReactComponents.Control.DisplayState.Ineligible,
            toggleEnabled: !1
        }),
        U(Panopto.GlobalResources.ViewerPlus_Edit_SmartChapters_NoSmartChapters)) : e === AutoInternal.SmartChaptersState.Available ? 0 === o.activeState().filterEvents(Panopto.Core.EventType.CandidateSmartOcrToc).length && 0 === o.activeState().filterEvents(Panopto.Core.EventType.SmartOcrToc).length ? Panopto.Core.ServiceInterface.Rest.Sessions.getAllEvents(o.getDeliveryId(), {
            eventTypes: [Panopto.Core.EventType.SmartOcrToc, Panopto.Core.EventType.CandidateSmartOcrToc],
            pageSize: Panopto.viewer.timelineEditorEventsPageSize
        }, (function(e) {
            var t, n;
            o.pushEdit(),
            (t = o.activeState().events()).push.apply(t, e),
            (n = o.savedEvents()).push.apply(n, e),
            o.activeState().refreshTimeline(),
            o.applyState(),
            M()
        }
        ), H) : M() : e === AutoInternal.SmartChaptersState.NotProcessed ? (U(Panopto.GlobalResources.ViewerPlus_Edit_SmartChapters_NotProcessed),
        D.setProps({
            displayState: PanoptoReactComponents.Control.DisplayState.NotProcessed
        }),
        U(Panopto.GlobalResources.ViewerPlus_Edit_SmartChapters_NotProcessed)) : e === AutoInternal.SmartChaptersState.Processing ? A() : H())
    };
    return l.refreshSmartChapters = function() {
        var e;
        if (o.activeState().streams().filter((function(e) {
            return e.isPrimary
        }
        )).length) {
            var t = o.savedEvents().filter((function(e) {
                return e.type === Panopto.Core.EventType.CandidateSmartOcrToc || e.type === Panopto.Core.EventType.SmartOcrToc
            }
            ));
            if (o.activeState().filterEvents(Panopto.Core.EventType.CandidateSmartOcrToc).length || o.activeState().filterEvents(Panopto.Core.EventType.SmartOcrToc).length)
                R.show(),
                M();
            else if (t.length) {
                var n = t.map((function(e) {
                    if (e.type === Panopto.Core.EventType.CandidateSmartOcrToc)
                        return e;
                    var t = e.copy();
                    return t.id = _.uniqueId("event"),
                    t.name = e.name.substring(0, PanoptoTS.Viewer.Constants.TOCMaxLength),
                    t.type = Panopto.Core.EventType.CandidateSmartOcrToc,
                    t
                }
                ));
                (e = o.activeState().events()).push.apply(e, n),
                R.show(),
                M()
            } else
                Panopto.viewer.isSmartChapteringEnabled && O.getSmartChaptersState(o.session().id, (function(e) {
                    return B(e.state)
                }
                ), H, (function() {
                    return null
                }
                ))
        }
    }
    ,
    l.refreshSmartChapters(),
    l
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.Editor = Panopto.Viewer.Tabs.Editor || {},
PanoptoLegacy.Viewer.Tabs.Editor.EditCutTab = function(e, t, n, o, i) {
    var a = PanoptoLegacy.Viewer.Tabs.Editor.EditorTab(e, t, n, Panopto.Viewer.Analytics.Labels.EditCut, o, Panopto.GlobalResources.ViewerPlus_Edit_Modal_EditCutTitle, i)
      , r = Panopto.Core.Extensions.base(a);
    return a.templateDialog = function(e, t) {
        var n, i, r, s, l, d = o.activeState();
        switch (t.targetType) {
        case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session:
            r = d.calculateEditorTimeForCut(t.start, void 0),
            s = d.calculateEditorTimeForCut(t.end(), void 0),
            l = Panopto.Core.Constants.SessionIconCode;
            break;
        case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream:
            var c = o.getStream(t.targetId)
              , u = d.calculateEditorTimeFromAbsolute(c.absoluteStart)
              , p = d.calculateEditorTimeFromAbsolute(c.absoluteEnd());
            n = o.getStreamName(c, c.id, !0),
            i = a.formatTime(u) + " - " + a.formatTime(p, !0),
            r = d.calculateEditorTimeForCut(t.start, t.targetId),
            s = d.calculateEditorTimeForCut(t.end(), t.targetId),
            l = PanoptoTS.Viewer.Controls.MaterialDesignIconHelpers.getStreamIconCode(c);
            break;
        case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.SessionReference:
            var f = _.find(d.sessionReferences, (function(e) {
                return e.id === t.targetId
            }
            ))
              , h = d.calculateSessionReferenceEditorStartTime(f) / Panopto.Core.Constants.TimelineChunkMultiplier
              , m = h + f.referencedSessionDuration;
            n = f.name,
            i = a.formatTime(h) + " - " + a.formatTime(m),
            r = d.calculateEditorTimeForCutInClip(t.start, t.targetId),
            s = d.calculateEditorTimeForCutInClip(t.end(), t.targetId),
            l = Panopto.Core.Constants.SessionIconCode
        }
        e.html(_.template($("#editCutTemplate").html())({
            cut: {
                streamName: n,
                streamLength: i,
                startTime: a.formatTime(r / Panopto.Core.Constants.TimelineChunkMultiplier),
                endTime: a.formatTime(s / Panopto.Core.Constants.TimelineChunkMultiplier),
                streamIconCode: l
            }
        }))
    }
    ,
    a.hasChanges = function(e, t) {
        var n = o.activeState()
          , i = n.calculateEditorTimeForCut(t.start, t.targetId) / Panopto.Core.Constants.TimelineChunkMultiplier
          , r = n.calculateEditorTimeForCut(t.end(), t.targetId) / Panopto.Core.Constants.TimelineChunkMultiplier;
        return e.find(".edit-cut-start-time").val() !== a.formatTime(i) || e.find(".edit-cut-end-time").val() !== a.formatTime(r)
    }
    ,
    a.validate = function(e, t) {
        var n, o = t.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream ? t.targetId : void 0, i = a.validateTime(e.find(".edit-cut-start-time").val(), o, void 0), r = a.validateTime(e.find(".edit-cut-end-time").val(), o, void 0);
        if (e.find(".edit-cut-start-time-error").text(i || ""),
        e.find(".edit-cut-end-time-error").text(r || ""),
        n = !i && !r) {
            var s = Panopto.Core.TimeHelpers.durationFromFormattedString(e.find(".edit-cut-start-time").val(), Panopto.GlobalResources.TimeSeparator);
            n = Panopto.Core.TimeHelpers.durationFromFormattedString(e.find(".edit-cut-end-time").val(), Panopto.GlobalResources.TimeSeparator) > s,
            e.find(".edit-cut-end-time-error").text(n ? "" : Panopto.GlobalResources.ViewerPlus_Edit_Modal_CutEndError)
        }
        return n
    }
    ,
    a.populateEvent = function(e, t) {
        var n = t.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream ? t.targetId : void 0
          , i = o.activeState().calculateEditorTimeForCut(t.start, n)
          , a = Panopto.Core.TimeHelpers.durationFromFormattedString(e.find(".edit-cut-start-time").val(), Panopto.GlobalResources.TimeSeparator) * Panopto.Core.Constants.TimelineChunkMultiplier
          , r = Panopto.Core.TimeHelpers.durationFromFormattedString(e.find(".edit-cut-end-time").val(), Panopto.GlobalResources.TimeSeparator) * Panopto.Core.Constants.TimelineChunkMultiplier
          , s = o.activeState()
          , l = s.calculateRelativeTimeForCut(a, t.targetId)
          , d = s.calculateRelativeTimeForCut(r, t.targetId);
        o.resizeCut(i, l, d, n, t.targetType)
    }
    ,
    a.render = function() {
        var e = _.map(a.events(), (function(e) {
            var t, n, i, a, r, s, l = o.activeState();
            switch (e.targetType) {
            case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session:
                t = l.calculateEditorTimeForCut(e.start, void 0),
                n = l.calculateEditorTimeForCut(e.end(), void 0),
                i = Panopto.GlobalResources.ViewerPlus_Edit_SessionCutName,
                a = !0,
                r = !0,
                s = Panopto.Core.Constants.SessionIconCode;
                break;
            case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream:
                var d = o.getStream(e.targetId);
                t = l.calculateEditorTimeForCut(e.start, e.targetId),
                n = l.calculateEditorTimeForCut(e.end(), e.targetId),
                i = o.getStreamName(d, e.targetId, !0),
                a = !d.isPrimary,
                r = !d.isPrimary,
                s = PanoptoTS.Viewer.Controls.MaterialDesignIconHelpers.getStreamIconCode(d);
                break;
            case Panopto.Core.ServiceInterface.Rest.Objects.TypeName.SessionReference:
                var c = _.find(l.sessionReferences, (function(t) {
                    return t.id === e.targetId
                }
                ));
                t = l.calculateEditorTimeForCutInClip(e.start, e.targetId),
                n = l.calculateEditorTimeForCutInClip(e.end(), e.targetId),
                i = c.name,
                a = !1,
                r = !0,
                s = Panopto.Core.Constants.SessionIconCode
            }
            var u = t / Panopto.Core.Constants.TimelineChunkMultiplier
              , p = n / Panopto.Core.Constants.TimelineChunkMultiplier;
            return {
                id: e.id,
                eventId: e.id,
                time: u,
                displayTime: "\n                        " + Panopto.Core.TimeHelpers.formatDuration(u, Panopto.GlobalResources.TimeSeparator) + " -\n                        " + Panopto.Core.TimeHelpers.formatDuration(p, Panopto.GlobalResources.TimeSeparator),
                text: i,
                editable: a,
                deletable: r,
                iconCode: s
            }
        }
        ));
        r.render(e)
    }
    ,
    a
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.Editor = Panopto.Viewer.Tabs.Editor || {},
Panopto.viewer = Panopto.viewer || {},
PanoptoLegacy.Viewer.Tabs.Editor.EditDetailsTab = function(e, t, n, o, i, a, r, s, l, d, c, u, p, f, h, m, v) {
    var y = Panopto.features.tagsEnabled ? PanoptoTS.Viewer.Data.TagHelper.convertDeliveryToModel(d) : []
      , P = Panopto.DetailsTab($("#editDetailsTab"), {
        isVisible: !1,
        editor: i,
        sessionId: r,
        name: s,
        description: l,
        tags: y,
        ownerId: c,
        ownerFullName: u,
        ownerBio: p,
        linkify: !1,
        tagsEnabled: Panopto.features.tagsEnabled,
        tagService: h,
        subscriptionsEnabled: Panopto.features.subscriptionsEnabled,
        subscriptionService: m,
        userService: v,
        resources: Panopto.GlobalResources,
        onSessionNameUpdate: function(e) {
            return n.updateSessionName(e, {
                fromHeader: !1
            })
        }
    });
    n.addSessionNameUpdateListener((function(e) {
        return P.setProps({
            name: e
        })
    }
    ));
    var g = PanoptoLegacy.Viewer.Tabs.Editor.EditTOCEventTab(e, t, o, Panopto.Viewer.Analytics.EditContents, i, a, [Panopto.Core.EventType.Label, Panopto.Core.EventType.SlideChange, Panopto.Core.EventType.SmartOcrToc, Panopto.Core.EventType.CandidateSmartOcrToc], Panopto.GlobalResources.ViewerPlus_Edit_AddTOC, f)
      , S = Panopto.Core.Extensions.base(g);
    return g.onSelectChangeRendered = function(e) {
        var t = e.selected;
        return P.setProps({
            isVisible: t
        })
    }
    ,
    g.resize = function(e, t) {
        S.resize(e, t),
        P.setProps({
            tabWidth: e,
            tabHeight: t
        })
    }
    ,
    g
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.Editor = Panopto.Viewer.Tabs.Editor || {},
PanoptoLegacy.Viewer.Tabs.Editor.EditEventTab = function(e, t, n, o, i, a, r, s, l, d) {
    var c, u, p, f = PanoptoLegacy.Viewer.Tabs.Editor.EditorTab(e, t, n, o, i, s, d), h = f, m = Panopto.Core.Extensions.base(f), v = t.find(".event-input"), y = t.find(".event-input-options"), P = {}, g = function(e) {
        e.keyCode === Panopto.Core.Key.Space && e.shiftKey && (e.preventDefault(),
        n.hotkey(e.keyCode))
    }, S = function(e, t) {
        var n = t.find(".event-text-input")
          , o = t.find(".event-text-content");
        Panopto.Core.UI.Handlers.hoverableParent(t, n, (function(t) {
            t ? (n.show(),
            o.hide(),
            function(e, t, n) {
                var o = P[e.id];
                o || (o = Panopto.Core.UI.Components.editableLabel(n, (function(t) {
                    var n = $.trim(t);
                    if (n) {
                        i.pushEdit();
                        var a = _.find(i.activeState().events(), (function(t) {
                            return e.id === t.id
                        }
                        ));
                        h.updateName(a, n),
                        a.edited = !0,
                        i.applyState()
                    } else
                        o.revert()
                }
                ), !0),
                n.attr("placeholder", Panopto.GlobalResources.ViewerPlus_EventTab_NoContent),
                n.keydown(g),
                P[e.id] = o),
                o.resize()
            }(e, 0, n)) : n.is(":focus") || (n.hide(),
            o.show())
        }
        ), {
            preserveExisting: !0
        })
    }, C = function() {
        c = n.position(),
        u = n.activePrimary().id;
        var e = n.activeSecondary();
        e && _.find(i.activeState().streams(), (function(t) {
            return t.id === e.id
        }
        )) && (p = e.id)
    }, w = function() {
        var e = $.trim(v.val());
        e && void 0 === c ? C() : e || h.clearStartTime()
    };
    h.clearStartTime = function() {
        c = void 0,
        u = void 0,
        p = void 0
    }
    ,
    h.filterForRender = function(e) {
        return _.filter(f.events(), (function(t) {
            return _.contains(r, t.type) && e == t.language && !t.isDefaultThumbnail
        }
        ))
    }
    ,
    f.render = function(e, t, n, o, i, a) {
        var r = h.filterForRender(a)
          , s = _.map(r, (function(e) {
            var t = e.link && -1 !== e.link.indexOf(PanoptoViewer.Constants.YouTubeEmbedBaseUrl);
            return {
                id: e.id,
                eventId: e.id,
                time: f.toTimelineRelativeTime(e.timelineTime),
                text: e.name,
                editable: !t,
                deletable: !0,
                language: a,
                inlineEditable: !0,
                iconClass: t ? PanoptoTS.Viewer.Constants.YouTubeIconClass : void 0
            }
        }
        ));
        m.render(s),
        P = {}
    }
    ,
    f.afterRenderItem = function(e, t, n) {
        m.afterRenderItem(e, t, n),
        S(e, t)
    }
    ,
    h.formatEventTime = function(e) {
        return f.formatTime(f.toTimelineRelativeTime(e.timelineTime))
    }
    ,
    h.eventTimeFromFormattedString = function(e) {
        var t = Panopto.Core.TimeHelpers.durationFromFormattedString(e, Panopto.GlobalResources.TimeSeparator)
          , n = new PanoptoTS.Core.Logic.Time.UneditedFirstPrimaryRelative(t * Panopto.Core.Constants.TimelineChunkMultiplier);
        return a.toWin32EpochRelative(n).ticks()
    }
    ,
    h.ownsEvent = function(e) {
        return _.contains(r, e.type)
    }
    ,
    h.clearInput = function() {
        v.val(""),
        h.clearStartTime(),
        v.attr("placeholder", l)
    }
    ,
    h.addEvent = function(e, t, n) {
        var o, r = void 0 === n ? {} : n, s = r.preferSecondary, l = r.link, d = r.language;
        void 0 === c && C();
        var m = !0;
        if (i.activeState().isTimeInSessionReference(c)) {
            var v = i.activeState().findNextTimeNotInSessionReference(c);
            if (v >= i.activeState().duration())
                alert(Panopto.GlobalResources.ViewerPlus_EventTab_EventDuringClipAtEnd),
                m = !1,
                h.clearStartTime();
            else if (confirm(Panopto.GlobalResources.ViewerPlus_EventTab_EventDuringClip)) {
                o = v;
                var y = new PanoptoTS.Core.Logic.Time.UneditedFirstPrimaryRelative(v)
                  , P = a.toWin32EpochRelative(y).ticks()
                  , g = i.activeState().activeStreams(P)
                  , S = _.find(g, (function(e) {
                    return !0 === e.isPrimary
                }
                ));
                u = S ? S.id : void 0;
                var w = _.find(g, (function(e) {
                    return !0 !== e.isPrimary
                }
                ));
                p = w ? w.id : void 0
            } else
                m = !1
        } else
            o = c * Panopto.Core.Constants.TimelineChunkMultiplier;
        if (m) {
            var b = new PanoptoTS.Core.Logic.Time.UneditedFirstPrimaryRelative(o)
              , T = Panopto.Core.ServiceInterface.Rest.Objects.Event({
                name: e,
                sessionId: i.session().id,
                timelineTime: a.toWin32EpochRelative(b).ticks(),
                type: t,
                language: d,
                streamId: s && p ? p : u
            });
            return l && (T.link = l),
            i.pushEdit(),
            f.events().push(T),
            i.activeState().refreshTimeline(),
            i.applyState(),
            h.clearInput(),
            T
        }
    }
    ,
    f.resize = function(e, t) {
        v.width(e - PanoptoTS.Viewer.Constants.InputMargin),
        y.width(e - PanoptoTS.Viewer.Constants.InputOptionsMargin),
        m.resize(e, t - (v.length ? v.outerHeight(!0) : 0) - (y.length ? y.outerHeight(!0) : 0))
    }
    ,
    h.updateName = function(e, t) {
        e.name = t
    }
    ,
    h.toggleControlsRequiringPrimaryStream = function() {
        b ? (v.show(),
        y.show()) : (v.hide(),
        y.hide())
    }
    ,
    h.startTime = function() {
        return c
    }
    ,
    v.length && (v.off(),
    v.attr("placeholder", l),
    v.keyup(w),
    v.keydown((function(e) {
        e.keyCode === Panopto.Core.Key.Enter && (e.preventDefault(),
        w(),
        void 0 !== c && h.addEvent($.trim(v.val()), void 0, {})),
        e.stopPropagation()
    }
    )),
    v.keydown(g)),
    f.setTimelineEditor = function(e) {
        m.setTimelineEditor(e),
        i = e
    }
    ;
    var b = _.some(i.activeState().streams(), (function(e) {
        return e.isPrimary
    }
    ));
    return h.toggleControlsRequiringPrimaryStream(),
    h
}
;
__extends = this && this.__extends || function() {
    var e = function(t, n) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        ,
        e(t, n)
    };
    return function(t, n) {
        if ("function" != typeof n && null !== n)
            throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function o() {
            this.constructor = t
        }
        e(t, n),
        t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype,
        new o)
    }
}();
!function(e) {
    !function(t) {
        !function(t) {
            !function(t) {
                var n = function() {
                    function t() {
                        var e = this;
                        this._seekCallbacks = new PanoptoCore.TypedCallback,
                        this.createElement(),
                        this.eventIcon = this.element.find(".event-icon"),
                        this.eventName = this.element.find(".event-name"),
                        this.eventDisplayTime = this.element.find(".event-display-time"),
                        Panopto.Core.UI.Handlers.button(this.element, (function() {
                            e._seekCallbacks.fire(e.event)
                        }
                        ))
                    }
                    return Object.defineProperty(t.prototype, "seekCallbacks", {
                        get: function() {
                            return this._seekCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    t.prototype.render = function(t, n) {
                        this.event = t;
                        var o = Panopto.Core.TimeHelpers.formatDuration(t.editorTime, Panopto.GlobalResources.TimeSeparator);
                        this.updateName(t.name),
                        this.eventDisplayTime.text(o);
                        var i = n && n.isQuestionList ? Panopto.Core.Constants.QuestionListIconCode : this.isLinkEvent(t) ? Panopto.Core.Constants.LinkIconCode : void 0
                          , a = this.isYoutubeEvent(t) ? e.Viewer.Constants.YouTubeIconClass : this.isSmartChapterEvent(t) ? e.Viewer.Constants.SmartChapterIconClass : i ? void 0 : e.Viewer.Constants.TocIconClass;
                        this.eventIcon.attr("class", "event-icon"),
                        i && this.eventIcon.addClass("material-icons"),
                        a && this.eventIcon.addClass(a),
                        this.eventIcon.html(i || "")
                    }
                    ,
                    t.prototype.createElement = function() {
                        this.element = $(t.template())
                    }
                    ,
                    t.prototype.updateName = function(e) {
                        this.eventName.text(e)
                    }
                    ,
                    t.prototype.isLinkEvent = function(e) {
                        var t;
                        return -1 === (null === (t = e.link) || void 0 === t ? void 0 : t.indexOf(PanoptoViewer.Constants.YouTubeEmbedBaseUrl))
                    }
                    ,
                    t.prototype.isYoutubeEvent = function(e) {
                        return e.link && -1 !== e.link.indexOf(PanoptoViewer.Constants.YouTubeEmbedBaseUrl)
                    }
                    ,
                    t.prototype.isSmartChapterEvent = function(e) {
                        return e.type === Panopto.Core.EventType.SmartOcrToc
                    }
                    ,
                    t.template = _.template('\n            <div class="editor-event-row" tabindex="0">\n                <div class="event-icon"></div>\n                <div class="event-name" dir="auto"></div>\n                <div class="event-display-time"></div>\n            </div>'),
                    t
                }();
                t.EditorEventRow = n;
                var o = function(t) {
                    function n() {
                        var n = t.call(this) || this;
                        return n._editCallbacks = new PanoptoCore.TypedCallback,
                        n._changedCallbacks = new PanoptoCore.TypedCallback,
                        n._deleteCallbacks = new PanoptoCore.TypedCallback,
                        n.eventInput = Panopto.Core.UI.Components.editableLabel(n.eventName.find("input")),
                        Panopto.Core.UI.Handlers.button(n.element, (function() {
                            n.element.addClass("focused"),
                            n.eventInput.focus()
                        }
                        ), {
                            preserveExisting: !0
                        }),
                        n.eventInput.onChanged.add((function(e) {
                            n._changedCallbacks.fire({
                                event: n.event,
                                name: e
                            })
                        }
                        )),
                        n.eventInput.onBlur.add((function() {
                            n.element.removeClass("focused")
                        }
                        )),
                        n.editEventMenu = new e.Viewer.Controls.EditEventMenu(n.element,n.element.find(".event-edit-toggle"),Panopto.GlobalResources,{
                            toggleAppearsOnHover: !0
                        }),
                        n.editEventMenu.editCallbacks.add((function(e) {
                            n._editCallbacks.fire(e)
                        }
                        )),
                        n.editEventMenu.deleteCallbacks.add((function(e) {
                            n._deleteCallbacks.fire(e)
                        }
                        )),
                        n
                    }
                    return __extends(n, t),
                    Object.defineProperty(n.prototype, "editCallbacks", {
                        get: function() {
                            return this._editCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(n.prototype, "changedCallbacks", {
                        get: function() {
                            return this._changedCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(n.prototype, "deleteCallbacks", {
                        get: function() {
                            return this._deleteCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    n.prototype.render = function(e, n) {
                        t.prototype.render.call(this, e, n),
                        this.editEventMenu.setEvent(e, {
                            canEdit: !(n && n.isQuestionList || this.isYoutubeEvent(e)),
                            canDelete: !0
                        })
                    }
                    ,
                    n.prototype.createElement = function() {
                        this.element = $(n.editableTemplate())
                    }
                    ,
                    n.prototype.updateName = function(e) {
                        this.eventInput.resetValue(e)
                    }
                    ,
                    n.editableTemplate = _.template('\n            <div class="editor-event-row" tabindex="0">\n                <div class="event-icon"></div>\n                <div class="event-name"><input dir="auto" type="text" placeholder="<@= Panopto.GlobalResources.ViewerPlus_EventTab_NoContent @>" /></div>\n                <div class="event-edit-toggle material-icons" tabindex="0" title="<@= Panopto.GlobalResources.ViewerPlus_EventMore @>">&#xE5D4;</div>\n                <div class="event-display-time"></div>\n            </div>'),
                    n
                }(n);
                t.EditableEventRow = o
            }(t.Editor || (t.Editor = {}))
        }(t.Tabs || (t.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.Editor = Panopto.Viewer.Tabs.Editor || {},
PanoptoLegacy.Viewer.Tabs.Editor.EditorTab = function(e, t, n, o, i, a, r) {
    var s = PanoptoLegacy.Viewer.Tabs.EventTab(e, t, n, void 0, [], void 0, !1, o, void 0, r)
      , l = s
      , d = Panopto.Core.Extensions.base(s)
      , c = t.find(".event-tab-pane-header")
      , u = []
      , p = t.find(".event-tab-list");
    return l.templateDialog = function(e, t) {
        $.noop()
    }
    ,
    l.hasChanges = function(e, t) {
        return !1
    }
    ,
    l.validate = function(e, t) {
        return !0
    }
    ,
    l.populateEvent = function(e, t) {
        $.noop()
    }
    ,
    l.formatTime = function(e, t) {
        return Panopto.Core.TimeHelpers.formatDuration(e, Panopto.GlobalResources.TimeSeparator, !0, Panopto.Core.Constants.DisplayTimeMillisecondPrecision, t)
    }
    ,
    l.validateTime = function(e, t, n) {
        var o, a, r, s, d;
        return e ? Panopto.Core.TimeHelpers.validateFormattedDuration(e, Panopto.GlobalResources.TimeSeparator, Panopto.Core.Constants.DisplayTimeMillisecondPrecision) ? n || ((r = t ? _.find(i.activeState().streams(), (function(e) {
            return e.id === t
        }
        )) : void 0) ? (s = i.activeState().calculateEditorTimeFromAbsolute(r.absoluteStart),
        d = i.activeState().calculateEditorTimeFromAbsolute(r.absoluteEnd())) : (s = 0,
        d = i.activeState().duration() / Panopto.Core.Constants.TimelineChunkMultiplier),
        s = Math.floor(s * PanoptoTS.Viewer.Constants.DisplayTimePrecisionMultiplier) / PanoptoTS.Viewer.Constants.DisplayTimePrecisionMultiplier,
        d = Math.ceil(d * PanoptoTS.Viewer.Constants.DisplayTimePrecisionMultiplier) / PanoptoTS.Viewer.Constants.DisplayTimePrecisionMultiplier,
        ((a = Panopto.Core.TimeHelpers.durationFromFormattedString(e, Panopto.GlobalResources.TimeSeparator)) < s || a > d) && (o = Panopto.GlobalResources.ViewerPlus_Edit_Modal_Error_OutOfBounds.format(l.formatTime(s), l.formatTime(d)))) : o = Panopto.GlobalResources.ViewerPlus_Edit_Modal_Error_InvalidTime : o = Panopto.GlobalResources.ViewerPlus_Edit_Modal_Error_NoTime,
        o
    }
    ,
    l.openEditDialog = function(e, t) {
        var o;
        n.toggleScreens(!1),
        Panopto.ModalPopup.defaultInstance.show("#editorDialog", t || a, ""),
        $("#editorDialog").show(),
        o = $("#editorDialogContent"),
        l.templateDialog(o, e),
        Panopto.ModalPopup.defaultInstance.closeCriteria.push((function() {
            return !l.hasChanges(o, e) || confirm(Panopto.GlobalResources.ViewerPlus_Edit_Modal_Confirm)
        }
        )),
        Panopto.Core.UI.Handlers.button($("#editorDialogSave"), (function() {
            var t = e.copy();
            if (l.validate(o, t)) {
                var n = _.find(u, (function(e) {
                    return e.id === t.id
                }
                ))
                  , a = u.indexOf(n);
                (l.hasChanges(o, t) || -1 === a) && (i.pushEdit(),
                -1 !== a ? u.splice(a, 1, t) : u.push(t),
                l.populateEvent(o, t),
                i.activeState().refreshTimeline(),
                i.applyState()),
                Panopto.ModalPopup.defaultInstance.closeCriteria.length = 0,
                Panopto.ModalPopup.defaultInstance.close()
            }
        }
        )),
        Panopto.Core.UI.Handlers.button($("#editorDialogCancel"), (function() {
            Panopto.ModalPopup.defaultInstance.close()
        }
        )),
        o.keydown((function(e) {
            e.stopPropagation()
        }
        )),
        o.find("textarea, input").first().focus()
    }
    ,
    l.render = function(e) {
        var t = !1
          , n = !0;
        0 === d.events().length && (t = !0,
        n = !1),
        d.render(e, t, !1, n, !0)
    }
    ,
    l.afterRenderItem = function(e, t, n) {
        d.afterRenderItem(e, t, n);
        var o = new PanoptoTS.Viewer.Controls.EditEventMenu(t,t.find(".event-edit-toggle"),Panopto.GlobalResources,{
            toggleAppearsOnHover: !0
        });
        o.editCallbacks.add((function(e) {
            l.openEditDialog(_.find(s.events(), (function(t) {
                return e.id === t.id
            }
            )))
        }
        )),
        o.deleteCallbacks.add((function(e) {
            var t;
            i.pushEdit(),
            t = _.find(s.events(), (function(t) {
                return e.id === t.id
            }
            )),
            s.events().splice(s.events().indexOf(t), 1),
            i.applyState()
        }
        )),
        o.setEvent(e, {
            canEdit: e.editable,
            canDelete: e.deletable
        })
    }
    ,
    l.events = function(e) {
        if (void 0 === e)
            return u;
        u = e,
        l.render(void 0, void 0, void 0, void 0, void 0)
    }
    ,
    l.valueChanged = function(e, t) {
        var n = e.val();
        return e.val(t),
        t = e.val(),
        e.val(n),
        n !== t
    }
    ,
    l.toTimelineRelativeTime = function(e) {
        return i.activeState().calculateEditorTimeFromAbsolute(e)
    }
    ,
    s.resize = function(e, t) {
        d.resize(e, t - (c.outerHeight() || 0))
    }
    ,
    l.setTimelineEditor = function(e) {
        i = e
    }
    ,
    l.$eventList = p,
    l
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.Editor = Panopto.Viewer.Tabs.Editor || {},
PanoptoLegacy.Viewer.Tabs.Editor.EditQuestionListTab = function(e, t, n, o, i, a, r) {
    var s = PanoptoLegacy.Viewer.Tabs.Editor.EditorTab(e, t, n, Panopto.Viewer.Analytics.Labels.EditQuestionList, o, void 0, r)
      , l = s
      , d = Panopto.Core.Extensions.base(s)
      , c = $("#addQuestionListButton");
    s.render = function() {
        var e = _.map(s.events(), (function(e) {
            var t = i.toUneditedFirstPrimaryRelative(e.firstStreamRelativeTicks);
            return {
                id: e.id,
                eventId: e.id,
                time: t.seconds(),
                displayTime: Panopto.Core.TimeHelpers.formatDuration(t.seconds(), Panopto.GlobalResources.TimeSeparator),
                text: e.name,
                deletable: !0,
                iconCode: Panopto.Core.Constants.QuestionListIconCode
            }
        }
        ));
        d.render(e)
    }
    ,
    s.position = function(e) {
        l.toggleControlsRequiringPrimaryStreamOrEvent(e),
        d.position(e)
    }
    ,
    l.toggleControlsRequiringPrimaryStreamOrEvent = function(e) {
        c.toggleClass(Panopto.Core.Constants.DisabledClass, !u || !a.isValidTimeForEmbeddedEvent(e))
    }
    ,
    Panopto.Core.UI.Handlers.button(c, (function() {
        c.hasClass(Panopto.Core.Constants.DisabledClass) || o.addQuestionList(void 0)
    }
    ));
    var u = _.some(o.activeState().streams(), (function(e) {
        return e.isPrimary
    }
    ));
    return l
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.Editor = Panopto.Viewer.Tabs.Editor || {},
PanoptoLegacy.Viewer.Tabs.Editor.EditSlidesTab = function(e, t, n, o, i, a, r, s) {
    var l, d = Panopto.Viewer.Analytics.EditSlides, c = PanoptoLegacy.Viewer.Tabs.Editor.EditTOCEventTab(e, t, n, d, o, r, [Panopto.Core.EventType.SlideChange], void 0, s), u = c, p = Panopto.Core.Extensions.base(c), f = {}, h = {}, m = {}, v = function(e) {
        var t = $.Deferred()
          , n = [];
        return _.each(e, (function(e) {
            n.push(y(e))
        }
        )),
        $.when.apply($, n).then((function() {
            t.resolve(e)
        }
        )).fail((function() {
            t.reject()
        }
        )),
        t.promise()
    }, y = function(e) {
        var t = $.Deferred();
        return Panopto.Core.ServiceInterface.Rest.SlideDecks.getAllSlides(e.id, (function(n) {
            f[e.id] = n,
            t.resolve(n)
        }
        ), (function() {
            t.reject()
        }
        )),
        t.promise()
    }, P = function(e) {
        var t = new PanoptoTS.Viewer.Tabs.Editor.SlideDeckRow(c.$eventList);
        return t.slideDeckDeletedCallbacks.add((function() {
            var t, n;
            o.pushEdit(),
            t = o.activeState().events(),
            n = _.filter(t, (function(t) {
                return _.some(f[e.id], (function(e) {
                    return e.id === t.slideId
                }
                ))
            }
            )),
            _.each(n, (function(e) {
                t.splice(t.indexOf(e), 1)
            }
            )),
            o.activeState().slideDecksToDelete().push(e),
            o.applyState()
        }
        )),
        t.slideEventAddCallbacks.add((function(e) {
            var t, i = n.position(), a = !0;
            if (o.activeState().isTimeInSessionReference(i)) {
                var s = o.activeState().findNextTimeNotInSessionReference(i);
                if (s >= o.activeState().duration())
                    alert(Panopto.GlobalResources.ViewerPlus_EventTab_EventDuringClipAtEnd),
                    a = !1,
                    c.clearStartTime();
                else
                    confirm(Panopto.GlobalResources.ViewerPlus_EventTab_EventDuringClip) ? t = s : a = !1
            } else
                t = i * Panopto.Core.Constants.TimelineChunkMultiplier;
            if (a) {
                var l = new PanoptoTS.Core.Logic.Time.UneditedFirstPrimaryRelative(t)
                  , d = Panopto.Core.ServiceInterface.Rest.Objects.Event({
                    name: e.name,
                    metadata: e.content,
                    timelineTime: r.toWin32EpochRelative(l).ticks(),
                    type: Panopto.Core.EventType.SlideChange,
                    slideId: e.id,
                    slideUrl: e.imageUrl,
                    thumbnailUrl: e.imageUrl,
                    slideDeckId: e.slideDeckId,
                    sessionId: o.session().id
                });
                o.pushEdit(),
                c.events().push(d),
                o.activeState().refreshTimeline(),
                o.applyState()
            }
        }
        )),
        t.slideEventSelectedCallbacks.add((function(e, t) {
            n.setPosition(t.editorTime),
            Panopto.Viewer.Analytics.sendEvent({
                action: Panopto.Viewer.Analytics.Actions.Navigate,
                label: d
            })
        }
        )),
        t.slideEventEditCallbacks.add((function(e, t) {
            c.openEditDialog(_.find(c.events(), (function(e) {
                return e.id === t.id
            }
            )))
        }
        )),
        t.slideEventDeleteCallbacks.add((function(e, t) {
            o.pushEdit();
            var n = c.events()
              , i = _.find(n, (function(e) {
                return t.id === e.id
            }
            ));
            n.splice(n.indexOf(i), 1),
            o.applyState()
        }
        )),
        t
    }, g = function(e) {
        var t = _.filter(c.events(), (function(t) {
            return t.type === Panopto.Core.EventType.SlideChange && t.slideId === e.id
        }
        ));
        return _.each(t, (function(t) {
            t.slideDeckId || (t.slideDeckId = e.slideDeckId),
            t.displayTime = Panopto.Core.TimeHelpers.formatDuration(t.editorTime, Panopto.GlobalResources.TimeSeparator)
        }
        )),
        t
    };
    a.onReady.add((function(e) {
        _.each(e, (function(e) {
            S(e)
        }
        )),
        u.setReadyStreamUploader(),
        u.hasAnyUploadingRow() && n.fireTabSelected(c)
    }
    )),
    u.setReadyStreamUploader = function() {
        o.overlayController.setEditSlidesTabAddButton($("#addSlideDeckButton")),
        o.overlayController.setOverlaysSlideUploader(a)
    }
    ,
    a.onBeforeUpload.add((function() {
        n.fireTabSelected(c)
    }
    )),
    a.onUpdate.add((function(e) {
        S(e)
    }
    )),
    a.onComplete.add((function(e) {
        var t;
        C(e),
        t = $.Deferred(),
        Panopto.Core.ServiceInterface.Rest.Sessions.getAllSlideDecks(o.session().id, (function(e) {
            v(e).then((function() {
                t.resolve(e)
            }
            )).fail((function() {
                t.reject()
            }
            ))
        }
        ), (function() {
            t.reject()
        }
        )),
        l = t.promise(),
        c.render(void 0, void 0, void 0, void 0, void 0)
    }
    )),
    a.onDelete.add((function(e) {
        C(e)
    }
    )),
    a.getCurrentUploads();
    var S = function(e) {
        if (!m.hasOwnProperty(e.uploadId)) {
            var t = new (i.debug ? PanoptoTS.Viewer.Tabs.Editor.PendingUploadRowDebug : PanoptoTS.Viewer.Tabs.Editor.PendingUploadRow)(Panopto.GlobalResources.ViewerPlus_Edit_InvalidSlideDeck,Panopto.GlobalResources);
            t.onPendingUploadDeleting.add((function(e) {
                a.cancelUpload(e)
            }
            )),
            m[e.uploadId] = t,
            c.$eventList.append(t.element)
        }
        m[e.uploadId].render(o.activeState(), e)
    }
      , C = function(e) {
        var t = m[e.uploadId];
        t && (t.element.remove(),
        delete m[e.uploadId])
    };
    return c.render = function() {
        l.then((function(e) {
            !function(e) {
                _.each(e, (function(e) {
                    h.hasOwnProperty(e.id) || (h[e.id] = P(e));
                    var t = h[e.id];
                    t.render(e),
                    _.each(f[e.id], (function(e) {
                        var n = g(e);
                        t.renderSlide(e, n)
                    }
                    ))
                }
                ))
            }(e),
            _.each(h, (function(e, t) {
                _.some(o.activeState().slideDecksToDelete(), (function(e) {
                    return e.id === t
                }
                )) && e.hide();
                var n = _.some(o.activeState().streams(), (function(e) {
                    return e.isPrimary
                }
                ));
                e.setCanAddSlide(n)
            }
            ))
        }
        ))
    }
    ,
    u.hasAnyUploadingRow = function() {
        return Object.keys(m).length > 0
    }
    ,
    c.setTimelineEditor = function(e) {
        p.setTimelineEditor(e),
        o = e
    }
    ,
    u.setSlideDecks = function(e) {
        l = v(e),
        c.render(void 0, void 0, void 0, void 0, void 0)
    }
    ,
    u
}
,
function(e) {
    !function(t) {
        !function(t) {
            !function(t) {
                var n = function() {
                    function t(n) {
                        this.element = $(t.template({
                            label: n
                        })),
                        this.element.hide(),
                        this.orderedContainer = new e.Viewer.Controls.OrderedContainer,
                        this.element.append(this.orderedContainer.element)
                    }
                    return t.prototype.addStreamRow = function(e, t) {
                        this.orderedContainer.insert(e.element, t),
                        this.element.show()
                    }
                    ,
                    t.prototype.addPendingUploadRow = function(e, t) {
                        this.orderedContainer.insert(e.element, t),
                        this.element.show()
                    }
                    ,
                    t.prototype.removeStreamRow = function(e) {
                        this.orderedContainer.remove(e.element),
                        0 === this.orderedContainer.rowCount() && this.element.hide()
                    }
                    ,
                    t.prototype.removePendingUploadRow = function(e) {
                        this.orderedContainer.remove(e.element),
                        0 === this.orderedContainer.rowCount() && this.element.hide()
                    }
                    ,
                    t.template = _.template('\n            <div class="edit-stream-list">\n                <div class="edit-stream-list-label"><@= label @></div>\n            </div>'),
                    t
                }();
                t.EditStreamList = n
            }(t.Editor || (t.Editor = {}))
        }(t.Tabs || (t.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.Editor = Panopto.Viewer.Tabs.Editor || {},
PanoptoLegacy.Viewer.Tabs.Editor.EditStreamTab = function(e, t, n, o, i, a, r, s, l) {
    var d = $(".add-streams")
      , c = PanoptoLegacy.Viewer.Tabs.Editor.EditorTab(e, t, n, Panopto.Viewer.Analytics.Labels.EditStream, o, Panopto.GlobalResources.ViewerPlus_Edit_Modal_EditStreamTitle, l)
      , u = c
      , p = Panopto.Core.Extensions.base(c)
      , f = new PanoptoTS.Viewer.Tabs.Editor.EditStreamList(Panopto.GlobalResources.ViewerPlus_Edit_Primary)
      , h = new PanoptoTS.Viewer.Tabs.Editor.EditStreamList(Panopto.GlobalResources.ViewerPlus_Edit_Secondary);
    c.$eventList.append(f.element).append(h.element);
    var m = _.template($("#editStreamTemplate").html())
      , v = $.Deferred()
      , y = !1
      , P = new PanoptoViewer.StreamDeleteUtils
      , g = {}
      , S = {};
    Panopto.Core.UI.Handlers.button(d, (function() {
        d.hasClass(Panopto.Core.Constants.DisabledClass) || o.streamTab().showUploadOverlay({
            secondaryOnly: !1
        })
    }
    ));
    var C = $("#deletingEventsPopupWrapper")
      , w = PanoptoReactComponents.bootstrapReactComponent(PanoptoReactComponents.Dialogs.DeletingEventsDialog)(C, {
        isOpen: !1,
        eventsToDelete: [],
        handleButtonClick: function(e) {},
        resources: Panopto.GlobalResources
    })
      , b = function(e) {
        if (!S.hasOwnProperty(e.uploadId)) {
            var t = R(e.streamType)
              , n = new (i.debug ? PanoptoTS.Viewer.Tabs.Editor.PendingUploadRowDebug : PanoptoTS.Viewer.Tabs.Editor.PendingUploadRow)(Panopto.GlobalResources.ViewerPlus_Edit_InvalidStreamFile,Panopto.GlobalResources);
            n.onPendingUploadDeleting.add((function(e) {
                a.cancelUpload(e)
            }
            )),
            S[e.uploadId] = n,
            t.addPendingUploadRow(n, Panopto.Core.TimeHelpers.dateToWin32EpochTime(e.startTime))
        }
        S[e.uploadId].render(o.activeState(), e)
    }
      , T = function(e) {
        var t = S[e.uploadId];
        if (t) {
            var n = R(e.streamType);
            delete S[e.uploadId],
            n.removePendingUploadRow(t)
        }
    }
      , E = function() {
        return _.some(c.events(), (function(e) {
            return e.isPrimary
        }
        ))
    }
      , V = function() {
        var e = _.some(c.events(), (function(e) {
            return !e.isPrimary
        }
        ))
          , t = _.some(o.activeState().events(), (function(e) {
            return e.slideId
        }
        ));
        return e || t
    }
      , I = function() {
        o.overlayController.updateOverlayProcessing(_.map(_.values(S), (function(e) {
            return e.pendingUpload
        }
        )))
    }
      , k = function(e) {
        var t = E()
          , i = V()
          , a = !i && u.hasPendingSecondaryUploads();
        n.synchronize(!0),
        !t || a || e ? u.showUploadOverlay({
            secondaryOnly: t && a
        }) : (o.overlayController.forceCloseOverlays(),
        (n.viewMode() === PanoptoTS.Viewer.ViewMode.Primary || i) && o.overlayController.toggleSecondaryPlaceholder(!1)),
        u.hasAnyUploadingRow() && (n.fireTabSelected(c),
        I())
    }
      , R = function(e) {
        var t;
        switch (e) {
        case 1:
            t = f;
            break;
        case 2:
            t = h
        }
        return t
    }
      , D = function(e) {
        var t, n = o.activeState().firstPrimaryOffset(), i = [], a = [], r = function(e, t, n) {
            var i, a = 0, r = Number.POSITIVE_INFINITY, s = Number.POSITIVE_INFINITY, l = Number.POSITIVE_INFINITY, d = Number.NEGATIVE_INFINITY;
            c.events().forEach((function(t) {
                t.isPrimary && t.id === e ? (a++,
                i = t) : t.isPrimary || t.id !== e ? t.isPrimary && t.id !== e ? (a++,
                s = Math.min(s, t.absoluteStart),
                r = Math.min(r, t.absoluteStart)) : s = Math.min(s, t.absoluteStart) : i = t
            }
            ));
            var u = Math.max(0, r - s);
            if (!i || !a)
                return {
                    case: PanoptoViewer.StreamDeleteCase.Unexpected
                };
            var p = o.activeState().events().filter((function(e) {
                return e.streamId === i.id && e.type === Panopto.Core.EventType.Caption
            }
            )).length > 0;
            return i.isPrimary ? 1 === a ? {
                case: PanoptoViewer.StreamDeleteCase.OnlyPrimary,
                streamObj: i,
                minTime: l,
                maxTime: d,
                newPrimaryOffset: u
            } : o.activeState().cuts().filter((function(e) {
                return e.targetId === i.id && e.duration === i.duration
            }
            )).length ? {
                case: PanoptoViewer.StreamDeleteCase.InactivePrimary,
                streamObj: i,
                minTime: l,
                maxTime: d,
                newPrimaryOffset: u,
                captionsWillBeDeleted: p
            } : (c.events().filter((function(t) {
                return t.isPrimary && t.id !== e
            }
            )).forEach((function(e) {
                var t = o.activeState().calculateEditorTimeFromAbsolute(e.absoluteStart)
                  , n = o.activeState().calculateEditorTimeFromAbsolute(e.absoluteStart + e.duration);
                l = Math.min(l, t),
                d = Math.max(d, n)
            }
            )),
            t.push.apply(t, o.activeState().questionLists().filter((function(e) {
                var t = e.firstStreamRelativeTicks.ticks() / Panopto.Core.Constants.TimelineChunkMultiplier;
                return t < l || t > d
            }
            ))),
            n.push.apply(n, o.activeState().events().filter((function(e) {
                return !(e.type !== Panopto.Core.EventType.Label || !e.link || -1 === e.link.toLowerCase().indexOf("www.youtube.com/embed")) && (e.editorTime < l || e.editorTime > d)
            }
            ))),
            {
                case: PanoptoViewer.StreamDeleteCase.ActivePrimary,
                streamObj: i,
                minTime: l,
                maxTime: d,
                newPrimaryOffset: u,
                captionsWillBeDeleted: p
            }) : {
                case: PanoptoViewer.StreamDeleteCase.Secondary,
                streamObj: i,
                minTime: l,
                maxTime: d,
                newPrimaryOffset: u,
                captionsWillBeDeleted: p
            }
        }(e.id, i, a), s = r.case, l = r.streamObj, d = r.minTime, u = r.maxTime, p = r.newPrimaryOffset, f = r.captionsWillBeDeleted;
        if (s !== PanoptoViewer.StreamDeleteCase.Unexpected)
            if (s !== PanoptoViewer.StreamDeleteCase.OnlyPrimary)
                if (f || i.length || a.length) {
                    var h = (t = i.map((function(e) {
                        return {
                            name: e.name,
                            type: "Quiz",
                            timeInSeconds: e.firstStreamRelativeTicks.ticks() / Panopto.Core.Constants.TimelineChunkMultiplier
                        }
                    }
                    ))).concat.apply(t, a.map((function(e) {
                        return {
                            name: e.name,
                            type: "YouTube",
                            timeInSeconds: e.editorTime
                        }
                    }
                    ))).sort((function(e, t) {
                        return e.timeInSeconds - t.timeInSeconds
                    }
                    ));
                    w.setProps({
                        isOpen: !0,
                        eventsToDelete: h,
                        captionsWillBeDeleted: f,
                        handleButtonClick: function(t) {
                            w.setProps({
                                isOpen: !1
                            }),
                            t && L(e, s, l, d, u, p, n, i, a)
                        }
                    })
                } else
                    L(e, s, l, d, u, p, n, i, a);
            else
                window.alert(Panopto.GlobalResources.ViewerPlus_Edit_DeleteStream_DeletingOnlyPrimary)
    }
      , L = function(e, t, n, i, a, r, s, l, d) {
        o.pushEdit();
        var u, p, f, h = [];
        o.activeState().cuts().forEach((function(t) {
            t.targetId === e.id && h.push(t)
        }
        )),
        t === PanoptoViewer.StreamDeleteCase.ActivePrimary ? function(e, t, n, i, a, r) {
            var s;
            o.activeState().cuts().sort((function(e, t) {
                return e.targetId === t.targetId ? e.start - t.start : e.targetId < t.targetId ? -1 : 1
            }
            ));
            var l = P.computeActiveSegments(e.absoluteStart, e.duration, o.activeState().cuts().filter((function(t) {
                return t.targetId === e.id
            }
            )))
              , d = o.activeState().cuts().filter((function(e) {
                return e.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream
            }
            ))
              , c = P.computeNewStreamCuts(o.activeState().streams().filter((function(t) {
                return t.isPrimary && t.id !== e.id
            }
            )), d, l, PanoptoTS.Viewer.Constants.StreamDeleteCutTolerance * Panopto.Core.Constants.TimelineChunkMultiplier);
            r.push.apply(r, c),
            o.activeState().cuts().filter((function(e) {
                return e.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Stream
            }
            )).forEach((function(e) {
                var t = o.activeState().cuts().indexOf(e);
                -1 !== t && o.activeState().cuts().splice(t, 1)
            }
            )),
            (s = o.activeState().cuts()).push.apply(s, d);
            var u = o.activeState().cuts().filter((function(e) {
                return e.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session
            }
            ))
              , p = P.computeNewSessionCuts(u, t, n, i, a, Panopto.Core.Constants.TimelineChunkMultiplier);
            r.push.apply(r, p.cutsToRemove),
            p.resizeHandlers.forEach((function(e) {
                o.resizeCut(e.oldStart, e.newStart, e.newEnd, e.newTargetId, e.newTargetType)
            }
            ))
        }(n, i, a, s, r, h) : t === PanoptoViewer.StreamDeleteCase.Secondary && function(e, t) {
            e !== t && o.activeState().cuts().filter((function(e) {
                return e.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session
            }
            )).forEach((function(n) {
                o.resizeCut(n.start - t, n.start - t + e, n.start + n.duration - t + e, n.targetId, n.targetType)
            }
            ))
        }(r, s),
        h.forEach((function(e) {
            var t = o.activeState().cuts().indexOf(e);
            -1 !== t && o.activeState().cuts().splice(t, 1)
        }
        )),
        u = n.id,
        p = d,
        f = l,
        o.activeState().events().filter((function(e) {
            return e.streamId === u
        }
        )).forEach((function(e) {
            if (e.type === Panopto.Core.EventType.Label && e.link && -1 !== e.link.toLowerCase().indexOf("www.youtube.com/embed")) {
                for (var t = !0, n = 0, i = p; n < i.length; n++)
                    if (i[n].id === e.id) {
                        t = !1;
                        break
                    }
                var a = !1;
                if (t)
                    for (var r = function(t) {
                        if (t.id === u)
                            return "continue";
                        var n = t.absoluteStart
                          , i = t.absoluteStart + t.duration
                          , r = e.timelineTime;
                        if (n <= r && i >= r) {
                            for (var s = !0, l = 0, d = o.activeState().cuts().filter((function(e) {
                                return e.targetId === t.id
                            }
                            )); l < d.length; l++) {
                                var c = d[l]
                                  , p = n + c.start
                                  , f = n + c.start + c.duration;
                                if (p <= r && f >= r) {
                                    s = !1;
                                    break
                                }
                            }
                            if (s)
                                return e.id = _.uniqueId("event"),
                                e.streamId = t.id,
                                a = !0,
                                "break"
                        }
                    }, s = 0, l = o.activeState().streams().filter((function(e) {
                        return e.isPrimary
                    }
                    )); s < l.length && "break" !== r(l[s]); s++)
                        ;
                if (a)
                    return
            }
            o.activeState().events().splice(o.activeState().events().indexOf(e), 1)
        }
        )),
        p.forEach((function(e) {
            for (var t = o.activeState().events(), n = -1, i = 0; i < t.length; i++)
                if (t[i].id === e.id) {
                    n = i;
                    break
                }
            -1 !== n && t.splice(n, 1)
        }
        )),
        f.forEach((function(e) {
            for (var t = o.activeState().questionLists(), n = -1, i = 0; i < t.length; i++)
                if (t[i].id === e.id) {
                    n = i;
                    break
                }
            -1 !== n && t.splice(n, 1)
        }
        ));
        var m = _.find(c.events(), (function(t) {
            return e.id === t.id
        }
        ));
        c.events().splice(c.events().indexOf(m), 1),
        o.activeState().refreshTimeline(),
        o.applyState(),
        m.isPrimary && o.setViewerPosition(0)
    };
    return c.templateDialog = function(e, t) {
        var n = [];
        PanoptoCore.forEachEnum(PanoptoViewer.MediaVRType, (function(e, t) {
            n.push({
                value: t,
                name: Panopto.GlobalResources["ViewerPlus_Edit_Modal_VRType_" + e]
            })
        }
        )),
        e.html(m({
            stream: {
                name: t.name,
                isPrimary: t.isPrimary,
                streamType: o.getStreamFriendlyType(t),
                displayType: t.isPrimary ? Panopto.GlobalResources.ViewerPlus_Edit_Primary : Panopto.GlobalResources.ViewerPlus_Edit_Secondary,
                length: Panopto.Core.TimeHelpers.formatDuration(t.duration / Panopto.Core.Constants.TimelineChunkMultiplier, Panopto.GlobalResources.TimeSeparator, !1, Panopto.Core.Constants.DisplayTimeMillisecondPrecision),
                startTime: c.formatTime(c.toTimelineRelativeTime(t.absoluteStart)),
                normalizeVolume: t.normalizeVolume,
                iconCode: t.iconCode,
                vrType: t.vrType
            },
            vrTypes: n,
            sessionNormalizeVolumeEnabled: o.activeState().getNormalizeVolume()
        }))
    }
    ,
    c.hasChanges = function(e, t) {
        var n = c.valueChanged(e.find(".edit-stream-name"), t.name);
        return n = (n = (n = n || e.find(".edit-stream-time").val() !== c.formatTime(c.toTimelineRelativeTime(t.absoluteStart))) || e.find(".edit-stream-normalize-volume").is(":checked") !== t.normalizeVolume && !o.activeState().getNormalizeVolume()) || parseInt(e.find(".edit-stream-vr-type").val(), 10) !== t.vrType
    }
    ,
    c.validate = function(e, t) {
        var n = c.validateTime(e.find(".edit-stream-time").val(), t.id, !0);
        return e.find(".edit-stream-time-error").text(n || ""),
        !n
    }
    ,
    c.populateEvent = function(e, t) {
        var n, i = o.activeState().absoluteStart(), a = o.activeState().firstPrimaryOffset(), r = Panopto.Core.TimeHelpers.durationFromFormattedString(e.find(".edit-stream-time").val(), Panopto.GlobalResources.TimeSeparator), l = new PanoptoTS.Core.Logic.Time.UneditedFirstPrimaryRelative(r * Panopto.Core.Constants.TimelineChunkMultiplier), d = s.toWin32EpochRelative(l), c = d.ticks() - t.absoluteStart, u = function(e) {
            var t = [];
            e && (_.each(o.activeState().cuts(), (function(n) {
                n.targetType === Panopto.Core.ServiceInterface.Rest.Objects.TypeName.Session && (n.end() + e <= o.activeState().firstPrimaryOffset() || n.start + e >= o.activeState().hostDuration() ? t.push(n) : (n.start = Math.max(n.start + e, o.activeState().firstPrimaryOffset()),
                n.duration = Math.min(n.duration, o.activeState().hostDuration() - n.start)))
            }
            )),
            _.each(t, (function(e) {
                o.activeState().cuts().splice(o.activeState().cuts().indexOf(e), 1)
            }
            )))
        };
        if (t.name = e.find(".edit-stream-name").val(),
        t.absoluteStart = d.ticks(),
        t.vrType = parseInt(e.find(".edit-stream-vr-type").val(), 10),
        o.activeState().refreshTimeline(),
        o.activeState().getNormalizeVolume() || (t.normalizeVolume = e.find(".edit-stream-normalize-volume").is(":checked")),
        c) {
            _.each(o.activeState().events(), (function(e) {
                e.streamId === t.id && (e.timelineTime += c,
                e.edited = !0)
            }
            ));
            var p = o.activeState().absoluteStart() - i;
            u(p || o.activeState().firstPrimaryOffset() - a),
            t.isPrimary && (n = _.filter(o.activeState().cuts(), (function(e) {
                return e.targetId === t.id
            }
            )),
            _.each(n, (function(e) {
                o.activeState().cuts().splice(o.activeState().cuts().indexOf(e), 1)
            }
            )),
            o.applyPrimaryHeuristicCuts())
        }
    }
    ,
    c.render = function() {
        _.each(c.events(), (function(e) {
            var t = PanoptoTS.Viewer.Data.Stream.convertFromApiModel(e)
              , i = R(t.streamType);
            if (!g.hasOwnProperty(t.id)) {
                var a = function() {
                    var e = new PanoptoTS.Viewer.Tabs.Editor.StreamRow;
                    return e.streamSeekCallbacks.add((function(e) {
                        n.setPosition(c.toTimelineRelativeTime(e.absoluteStart))
                    }
                    )),
                    e.streamEditCallbacks.add((function(e) {
                        c.openEditDialog(_.find(c.events(), (function(t) {
                            return t.id === e.id
                        }
                        )))
                    }
                    )),
                    e.streamDeleteCallbacks.add((function(e) {
                        D(e)
                    }
                    )),
                    e
                }();
                g[t.id] = a
            }
            i.addStreamRow(g[t.id], t.absoluteStart),
            g[t.id].render(o.activeState(), t)
        }
        )),
        _.each(g, (function(e, t) {
            _.some(c.events(), (function(e) {
                return e.id === t
            }
            )) || (R(e.getStream().streamType).removeStreamRow(e),
            delete g[t])
        }
        )),
        v.resolve()
    }
    ,
    u.hasAnyUploadingRow = function() {
        return Object.keys(S).length > 0
    }
    ,
    u.hasPendingSecondaryUploads = function() {
        return _.some(_.values(S), (function(e) {
            return 2 === e.pendingUpload.streamType
        }
        ))
    }
    ,
    u.showUploadOverlay = function(e) {
        var t = (void 0 === e ? {} : e).secondaryOnly
          , i = void 0 !== t && t;
        o.overlayController.showOverlays(E(), V(), _.map(_.values(S), (function(e) {
            return e.pendingUpload
        }
        )), n.viewMode(), {
            secondaryOnly: i
        })
    }
    ,
    v.then((function() {
        a.getCurrentUploads()
    }
    )),
    a.onReady.add((function(e) {
        _.each(e, (function(e) {
            b(e)
        }
        )),
        u.setReadyStreamUploader(),
        y = !0,
        k(!1)
    }
    )),
    u.setReadyStreamUploader = function() {
        o.overlayController.setOverlaysStreamUploader(a)
    }
    ,
    a.onBeforeUpload.add((function() {
        k(!0)
    }
    )),
    a.onUpdate.add((function(e) {
        var t = !S[e.uploadId];
        b(e),
        y && (t ? k(!0) : I())
    }
    )),
    a.onComplete.add((function(e) {
        T(e),
        r.getAllStreams(o.session().id, (function(e) {
            o.pushEdit(),
            o.activeState().streams().length = 0,
            _.each(e, (function(e) {
                o.activeState().streams().push(e)
            }
            )),
            o.activeState().refreshTimeline(),
            k(!1),
            n.setSecondaryCount(0),
            n.reinitializeDelivery()
        }
        ))
    }
    )),
    a.onDelete.add((function(e) {
        T(e),
        k(!1)
    }
    )),
    c.setTimelineEditor = function(e) {
        p.setTimelineEditor(e),
        (o = e).onAddContentRequirementChanged.add((function(e) {
            d.toggleClass(Panopto.Core.Constants.DisabledClass, !e.canAddContent)
        }
        ))
    }
    ,
    u
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.Editor = Panopto.Viewer.Tabs.Editor || {},
PanoptoLegacy.Viewer.Tabs.Editor.EditTOCEventTab = function(e, t, n, o, i, a, r, s, l) {
    var d = PanoptoLegacy.Viewer.Tabs.Editor.EditEventTab(e, t, n, o, i, a, r, Panopto.GlobalResources.ViewerPlus_Edit_Modal_EditTOCTitle, s, l)
      , c = Panopto.Core.Extensions.base(d)
      , u = window.location.protocol + "//"
      , p = /^.*?:\/\//;
    return d.templateDialog = function(e, t) {
        var n = function() {
            var n, o = [];
            if (d.validateTime(e.find(".edit-contents-time").val(), void 0, void 0))
                o.push(_.find(i.activeState().streams(), (function(e) {
                    return e.id === t.streamId
                }
                )));
            else {
                var a = d.valueChanged(e.find(".edit-contents-time"), d.formatEventTime(t)) ? d.eventTimeFromFormattedString(e.find(".edit-contents-time").val()) : t.timelineTime;
                o = i.activeState().activeStreams(a)
            }
            e.find(".edit-contents-stream").html(_.template($("#editStreamOptionTemplate").html())({
                streams: _.map(o, (function(e) {
                    return {
                        id: e.id,
                        displayName: i.getStreamName(e, e.id, !0)
                    }
                }
                ))
            })),
            n = _.find(o, (function(e) {
                return e.id === t.streamId
            }
            )) || o[0],
            e.find(".edit-contents-stream").val(n.id)
        };
        e.html(_.template($("#editContentsTemplate").html())({
            event: {
                name: t.name,
                formattedTime: d.formatEventTime(t),
                thumbnailSrc: t.thumbnailUrl || Panopto.cacheRoot + "/Images/no_thumbnail.svg",
                thumbnailGenerated: !t.thumbnailUrl,
                metadata: t.metadata,
                scheme: u,
                link: t.link ? t.link.replace(p, "") : "",
                streamId: t.streamId
            }
        })),
        t.streamId && (n(),
        e.find(".edit-contents-time").blur(n)),
        e.find(".edit-contents-link").width(e.find(".edit-contents-link").width() - e.find(".edit-contents-link-scheme").width() - 5)
    }
    ,
    d.hasChanges = function(e, t) {
        var n = d.valueChanged(e.find(".edit-contents-title"), t.name);
        return n = (n = (n = (n = n || d.valueChanged(e.find(".edit-contents-time"), d.formatEventTime(t))) || t.streamId && t.streamId !== e.find(".edit-contents-stream").val()) || d.valueChanged(e.find(".edit-contents-metadata"), t.metadata)) || d.valueChanged(e.find(".edit-contents-link"), t.link ? t.link.replace(p, "") : "")
    }
    ,
    d.validate = function(e, t) {
        var n = d.validateTime(e.find(".edit-contents-time").val(), e.find(".edit-contents-stream").val() || void 0, void 0);
        if (!n) {
            var o = Panopto.Core.TimeHelpers.durationFromFormattedString(e.find(".edit-contents-time").val(), Panopto.GlobalResources.TimeSeparator);
            if (i.activeState().isTimeInSessionReference(o)) {
                var a = i.activeState().findNextTimeNotInSessionReference(o)
                  , r = Panopto.Core.TimeHelpers.formatDuration(a / Panopto.Core.Constants.TimelineChunkMultiplier, Panopto.GlobalResources.TimeSeparator, !0, Panopto.Core.Constants.DisplayTimeMillisecondPrecision);
                n = Panopto.GlobalResources.ViewerPlus_Edit_Modal_Error_TimeInClip.format(r)
            }
        }
        return e.find(".edit-contents-time-error").text(n || ""),
        !n
    }
    ,
    d.populateEvent = function(e, t) {
        var n = e.find(".edit-contents-link").val()
          , o = e.find(".edit-contents-stream").val();
        t.name = e.find(".edit-contents-title").val(),
        t.timelineTime = d.eventTimeFromFormattedString(e.find(".edit-contents-time").val()),
        t.metadata = e.find(".edit-contents-metadata").val(),
        t.link = n ? u + n.replace(p, "") : void 0,
        t.streamId && t.streamId !== o && (t.id = _.uniqueId("event"),
        t.streamId = o,
        t.thumbnailUrl = void 0,
        t.slideUrl = void 0),
        t.edited = !0
    }
    ,
    d.setTimelineEditor = function(e) {
        c.setTimelineEditor(e),
        i = e
    }
    ,
    d
}
,
(Panopto = Panopto || {}).Viewer = Panopto.Viewer || {},
Panopto.Viewer.Tabs = Panopto.Viewer.Tabs || {},
Panopto.Viewer.Tabs.Editor = Panopto.Viewer.Tabs.Editor || {},
PanoptoLegacy.Viewer.Tabs.Editor.EditTranscriptTab = function(e, t, n, o, i, a, r) {
    var s, l = "\n        <span class='max-length-notification'>\n            " + Panopto.GlobalResources.ViewerPlus_Edit_CaptionLengthNotification + "\n        </span>", d = [Panopto.Core.EventType.Caption], c = PanoptoLegacy.Viewer.Tabs.Editor.EditEventTab(e, t, n, Panopto.Viewer.Analytics.EditTranscript, o, i, d, Panopto.GlobalResources.ViewerPlus_Edit_Modal_EditCaptionTitle, Panopto.GlobalResources.ViewerPlus_Edit_AddCaption, r), u = Panopto.Core.Extensions.base(c), p = t.find("#editTranscriptPaneHeader"), f = p.find("#importTranscriptButton"), h = p.find("#importTranscriptPopup"), m = p.find("#importMachineTranscriptButton"), v = p.find("#requestTranscriptButton"), y = t.find(".event-input-wrapper"), P = y.find(".event-input"), g = y.find(".max-length-notification");
    Panopto.LanguageSelector($("#languageSelector"), {
        availableLanguages: a,
        resources: Panopto.GlobalResources,
        defaultLanguage: Panopto.viewer.defaultContentLanguage,
        onLanguageSelected: function(e) {
            s = e,
            u.render(c.events(), !0, void 0, void 0, void 0, s)
        }
    }),
    c.render = function(e, t, n, i, a) {
        var r = o.activeState().filterEvents(Panopto.Core.EventType.Caption).length > 0;
        m.text(r ? Panopto.GlobalResources.ViewerPlus_Edit_ReplaceWithMachineTranscript : Panopto.GlobalResources.ViewerPlus_Edit_ImportMachineTranscript),
        S(P, g),
        u.render(e, t, n, i, a, s)
    }
    ,
    c.templateDialog = function(e, t) {
        e.html(_.template($("#editTranscriptTemplate").html())({
            event: {
                name: t.name,
                formattedTime: c.formatEventTime(t)
            }
        }))
    }
    ,
    c.hasChanges = function(e, t) {
        var n = c.valueChanged(e.find(".edit-transcript-title"), t.name);
        return n = n || c.valueChanged(e.find(".edit-transcript-time"), c.formatEventTime(t))
    }
    ,
    c.validate = function(e, t) {
        var n, i;
        if (n = !!$.trim(e.find(".edit-transcript-title").val()),
        e.find(".edit-transcript-title-error").text(n ? "" : Panopto.GlobalResources.ViewerPlus_Edit_Modal_Error_NoCaption),
        !(i = c.validateTime(e.find(".edit-transcript-time").val(), t.streamId, void 0))) {
            var a = Panopto.Core.TimeHelpers.durationFromFormattedString(e.find(".edit-transcript-time").val(), Panopto.GlobalResources.TimeSeparator);
            if (o.activeState().isTimeInSessionReference(a)) {
                var r = o.activeState().findNextTimeNotInSessionReference(a)
                  , s = Panopto.Core.TimeHelpers.formatDuration(r / Panopto.Core.Constants.TimelineChunkMultiplier, Panopto.GlobalResources.TimeSeparator, !0, Panopto.Core.Constants.DisplayTimeMillisecondPrecision);
                i = Panopto.GlobalResources.ViewerPlus_Edit_Modal_Error_TimeInClip.format(s)
            }
        }
        return e.find(".edit-transcript-time-error").text(i || ""),
        n = n && !i
    }
    ,
    c.populateEvent = function(e, t) {
        c.updateName(t, e.find(".edit-transcript-title").val()),
        t.timelineTime = c.eventTimeFromFormattedString(e.find(".edit-transcript-time").val()),
        t.edited = !0
    }
    ,
    c.updateName = function(e, t) {
        u.updateName(e, t),
        e.metadata && (e.metadata = t)
    }
    ,
    c.addEvent = function(e) {
        u.addEvent(e, Panopto.Core.EventType.Caption, {
            language: s
        }),
        g.hide()
    }
    ,
    c.filterForRender = function() {
        return _.filter(c.events(), (function(e) {
            return (_.contains(d, e.type) || e.forceShow && e.type === Panopto.Core.EventType.SpeechRecognition) && s == e.language
        }
        ))
    }
    ,
    Panopto.Core.UI.Components.popup(h, f, (function() {
        h.show().css({
            top: p.outerHeight() + "px"
        }),
        m.toggle(o.activeState().filterEvents(Panopto.Core.EventType.SpeechRecognition).length > 0)
    }
    )),
    Panopto.Core.UI.Handlers.button(m, (function() {
        var e;
        h.hide(),
        o.pushEdit();
        var t = _.filter(o.activeState().events(), (function(e) {
            return e.type === Panopto.Core.EventType.SpeechRecognition && !e.forceShow
        }
        ));
        e = _.map(t, (function(e) {
            var t = e.copy();
            return t.forceShow = !0,
            t.id = _.uniqueId("event"),
            t.language = s,
            t
        }
        ));
        var n = _.filter(o.activeState().events(), (function(e) {
            return (e.type === Panopto.Core.EventType.Caption || e.type === Panopto.Core.EventType.SpeechRecognition && e.forceShow) && e.language == s
        }
        ));
        _.each(n, (function(e) {
            c.events().splice(c.events().indexOf(e), 1)
        }
        )),
        _.each(e, (function(e) {
            c.events().push(e)
        }
        )),
        o.activeState().refreshTimeline(),
        o.applyState()
    }
    )),
    Panopto.Core.UI.Handlers.button(v, (function() {
        h.hide(),
        n.toggleScreens(!1),
        Panopto.Application.defaultInstance.updateState({
            modalPage: "SessionTranscript",
            modalHeader: Panopto.Core.TextHelpers.innerText(o.session().name),
            modalParams: Panopto.Core.StringHelpers.serializeObjectToQueryString({
                id: o.session().id
            })
        })
    }
    )),
    c.afterRenderItem = function(e, t, n) {
        u.afterRenderItem(e, t, n);
        var i = $(l);
        t.find(".event-text").append(i);
        var a = t.find(".event-text-input");
        S(a, i),
        a.keydown((function(e) {
            if (e.keyCode === Panopto.Core.Key.Enter) {
                var n = $("#editTranscriptTabPane .index-event")
                  , o = n.index(t);
                if (n[o].tabIndex = -1,
                o + 1 < n.length) {
                    var i = n[o + 1];
                    i.focus(),
                    i.tabIndex = 0;
                    var a = $(i).find(".event-text-input");
                    a.focus(),
                    a.select()
                }
            }
        }
        )),
        a.focus((function() {
            o.setViewerPosition(e.time)
        }
        ))
    }
    ;
    var S = function(e, t) {
        e.attr("maxlength", PanoptoTS.Viewer.Constants.CaptionMaxLength),
        e.on("input focus", (function() {
            var n = e.val().length >= PanoptoTS.Viewer.Constants.CaptionMaxLength;
            t.toggle(n)
        }
        )),
        e.on("blur", (function() {
            t.hide()
        }
        ))
    };
    return c
}
,
function(e) {
    !function(t) {
        !function(t) {
            !function(t) {
                var n = PanoptoCore.TypedCallback
                  , o = e.Core.Logic.Time.UneditedFirstPrimaryRelative
                  , i = function() {
                    function t(e) {
                        this.timeConverter = e,
                        this._eventAdded = new n
                    }
                    return Object.defineProperty(t.prototype, "eventAdded", {
                        get: function() {
                            return this._eventAdded
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    t.prototype.getActiveStreamIdAtTime = function(e, t) {
                        var n = this.timelineState.activeStreams(e)
                          , o = _.find(n, (function(e) {
                            return !0 === e.isPrimary
                        }
                        ))
                          , i = _.find(n, (function(e) {
                            return !0 !== e.isPrimary
                        }
                        ))
                          , a = void 0 !== o ? o.id : void 0
                          , r = void 0 !== i ? i.id : void 0;
                        return t && void 0 !== r ? r : a
                    }
                    ,
                    t.prototype.isCloseToAnotherEmbeddedEvent = function(t) {
                        var n = this
                          , o = function(t, n, o) {
                            return t > n - e.Viewer.Constants.UrlEventClosenessTolerance && t < o + e.Viewer.Constants.UrlEventClosenessTolerance
                        }
                          , i = _.any(this.timelineState.questionLists(), (function(e) {
                            var i = n.timeConverter.toFirstPrimaryRelative(e.firstStreamRelativeTicks).seconds()
                              , a = i + PanoptoViewer.Constants.UrlEventDuration;
                            return o(t, i, a)
                        }
                        ))
                          , a = _.any(this.timelineState.events(), (function(e) {
                            if (e.link && -1 !== e.link.indexOf(PanoptoViewer.Constants.YouTubeEmbedBaseUrl)) {
                                var i = n.timelineState.calculateEditorTimeTicksFromAbsolute(e.timelineTime) / Panopto.Core.Constants.TimelineChunkMultiplier
                                  , a = i + PanoptoViewer.Constants.UrlEventDuration;
                                return o(t, i, a)
                            }
                        }
                        ));
                        return i || a
                    }
                    ,
                    t.prototype.addEvent = function(e, t, n, o, i) {
                        var a = Panopto.Core.ServiceInterface.Rest.Objects.Event({
                            name: e,
                            sessionId: this.sessionId,
                            timelineTime: t,
                            type: n,
                            streamId: o,
                            link: i
                        });
                        this._eventAdded.fire(a)
                    }
                    ,
                    t.prototype.applyState = function(e, t) {
                        this.sessionId = e,
                        this.timelineState = t
                    }
                    ,
                    t.prototype.isValidTimeForEmbeddedEvent = function(e) {
                        return !this.isCloseToAnotherEmbeddedEvent(e) && this.isValidTimeForEvent(e)
                    }
                    ,
                    t.prototype.isValidTimeForEvent = function(e) {
                        return !this.timelineState.isTimeInSessionReference(e)
                    }
                    ,
                    t.prototype.addYouTubeEvent = function(e, t) {
                        if (this.isValidTimeForEmbeddedEvent(t)) {
                            var n = new o(t * Panopto.Core.Constants.TimelineChunkMultiplier)
                              , i = this.timeConverter.toWin32EpochRelative(n)
                              , a = this.getActiveStreamIdAtTime(i.ticks(), !1);
                            this.addEvent(e, i.ticks(), Panopto.Core.EventType.Label, a, PanoptoViewer.Constants.YouTubeEmbedBaseUrl)
                        }
                    }
                    ,
                    t.prototype.addUrlEvent = function(e, t) {
                        if (this.isValidTimeForEvent(t)) {
                            var n = new o(t * Panopto.Core.Constants.TimelineChunkMultiplier)
                              , i = this.timeConverter.toWin32EpochRelative(n)
                              , a = this.getActiveStreamIdAtTime(i.ticks(), !1)
                              , r = e.match(Panopto.Core.Constants.UrlMatcher) ? e : void 0;
                            this.addEvent(e, i.ticks(), Panopto.Core.EventType.Label, a, r)
                        }
                    }
                    ,
                    t
                }();
                t.EventService = i
            }(t.Editor || (t.Editor = {}))
        }(t.Tabs || (t.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(e) {
        !function(e) {
            !function(e) {
                var t = function() {
                    function e(t, n) {
                        var o = this;
                        this.invalidFileErrorLabel = t,
                        this.resources = n,
                        this._onPendingUploadDeleting = new PanoptoCore.TypedCallback,
                        this.element = $(e.template()),
                        this.uploadIcon = this.element.find(".upload-icon"),
                        this.uploadName = this.element.find(".upload-name"),
                        this.uploadDelete = this.element.find(".upload-delete"),
                        this.uploadEventTime = this.element.find(".upload-event-time"),
                        this.uploadProgress = this.element.find(".upload-progress"),
                        this.uploadProgressBar = this.element.find(".upload-progress-bar"),
                        this.uploadBytes = this.element.find(".upload-bytes"),
                        this.uploadProcessing = this.element.find(".upload-processing"),
                        this.uploadError = this.element.find(".upload-error"),
                        Panopto.Core.UI.Handlers.button(this.uploadDelete, (function() {
                            o._onPendingUploadDeleting.fire(o.pendingUpload)
                        }
                        ))
                    }
                    return Object.defineProperty(e.prototype, "onPendingUploadDeleting", {
                        get: function() {
                            return this._onPendingUploadDeleting
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    e.prototype.render = function(e, t) {
                        if (this.pendingUpload = t,
                        t.startTime) {
                            var n = void 0;
                            if (e.absoluteStart() === 1 / 0)
                                n = 0;
                            else {
                                var o = Panopto.Core.TimeHelpers.dateToWin32EpochTime(t.startTime) * Panopto.Core.Constants.TimelineChunkMultiplier;
                                n = e.calculateEditorTimeFromAbsolute(o)
                            }
                            var i = Panopto.Core.TimeHelpers.formatDuration(n, Panopto.GlobalResources.TimeSeparator);
                            this.uploadEventTime.text(i + " - ...")
                        } else
                            this.uploadEventTime.text("");
                        switch (this.uploadIcon.html(t.iconCode),
                        this.uploadName.text(t.filename),
                        t.state) {
                        case 1:
                            this.renderUploadProgress(t.bytesUploaded, t.fileSize);
                            break;
                        case 2:
                            this.renderProcessing();
                            break;
                        case 3:
                            this.renderError(this.invalidFileErrorLabel);
                            break;
                        case 4:
                            this.renderError(Panopto.Core.StringHelpers.format(this.resources.ViewerPlus_Edit_LargeFile, Panopto.Core.StringHelpers.readableByteCount(Panopto.features.uploadByteLimit, this.resources)));
                            break;
                        case 5:
                            this.renderError(Panopto.GlobalResources.ViewerPlus_Edit_UploadError);
                            break;
                        case 6:
                            this.renderError(t.errorMessage ? t.errorMessage : Panopto.GlobalResources.ViewerPlus_Edit_UploadProcessingError);
                            break;
                        case 7:
                            this.renderError(Panopto.GlobalResources.ViewerPlus_Edit_UploadDeleteError);
                            break;
                        default:
                            $.noop()
                        }
                        this.element.show()
                    }
                    ,
                    e.prototype.renderUploadProgress = function(e, t) {
                        this.setUploadProgress(e, t),
                        this.uploadProgress.show(),
                        this.uploadProcessing.hide(),
                        this.uploadError.text("").hide()
                    }
                    ,
                    e.prototype.renderError = function(e) {
                        this.unsetUploadProgress(),
                        this.uploadProgress.hide(),
                        this.uploadProcessing.hide(),
                        this.uploadError.text(e).attr("title", e).show()
                    }
                    ,
                    e.prototype.renderProcessing = function() {
                        this.unsetUploadProgress(),
                        this.uploadProgress.hide(),
                        this.uploadProcessing.show(),
                        this.uploadError.text("").hide()
                    }
                    ,
                    e.prototype.setUploadProgress = function(e, t) {
                        var n = Panopto.Core.StringHelpers.readableUploadProgress(e, t, Panopto.GlobalResources, "ViewerPlus_Edit_UploadProgress");
                        this.uploadBytes.text(n).show(),
                        this.uploadProgressBar.css("width", e / t * 100 + "%").show(),
                        this.uploadDelete.show()
                    }
                    ,
                    e.prototype.unsetUploadProgress = function() {
                        this.uploadBytes.text("").hide(),
                        this.uploadProgressBar.hide(),
                        this.uploadDelete.hide()
                    }
                    ,
                    e.template = _.template('\n            <div class="upload-row">\n                <div class="upload-metadata">\n                    <div class="upload-icon material-icons"></div>\n                    <div class="upload-name ellipsis"></div>\n                    <div class="upload-delete material-icons">&#xE14C;</div>\n                    <div class="upload-event-time"></div>\n                </div>\n                <div class="upload-progress">\n                    <div class="upload-progress-bar"></div>\n                    <div class="upload-bytes"></div>\n                </div>\n                <div class="upload-processing">\n                    <span><@= Panopto.GlobalResources.ViewerPlus_Edit_UploadProcessing @></span>\n                    <span class="upload-spinner"></span>\n                </div>\n                <div class="upload-error error"></div>\n            </div>'),
                    e
                }();
                e.PendingUploadRow = t
            }(e.Editor || (e.Editor = {}))
        }(e.Tabs || (e.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
var PanoptoTS;
__extends = this && this.__extends || function() {
    var e = function(t, n) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        ,
        e(t, n)
    };
    return function(t, n) {
        if ("function" != typeof n && null !== n)
            throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
        function o() {
            this.constructor = t
        }
        e(t, n),
        t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype,
        new o)
    }
}();
!function(e) {
    !function(e) {
        !function(t) {
            !function(t) {
                var n = "PendingUploadRow_Uploading"
                  , o = "PendingUploadRow_Processing"
                  , i = "PendingUploadRow_Error"
                  , a = function(e) {
                    function t(t, a) {
                        var r = e.call(this, t, a) || this;
                        return document.addEventListener(n, (function(e) {
                            e instanceof CustomEvent && r.renderUploadProgress(e.detail.bytesUploaded, e.detail.fileSize)
                        }
                        )),
                        document.addEventListener(o, (function(e) {
                            e instanceof CustomEvent && r.renderProcessing()
                        }
                        )),
                        document.addEventListener(i, (function(e) {
                            e instanceof CustomEvent && r.renderError(e.detail.error)
                        }
                        )),
                        r
                    }
                    return __extends(t, e),
                    t
                }(t.PendingUploadRow);
                t.PendingUploadRowDebug = a;
                var r = function(e) {
                    function t(t, n) {
                        var o = e.call(this) || this;
                        return o.bytesUploaded = t,
                        o.fileSize = n,
                        o
                    }
                    return __extends(t, e),
                    t.prototype.typeArg = function() {
                        return n
                    }
                    ,
                    t
                }(e.DebugEventModel);
                t.PendingUploadRowUploadingModel = r;
                var s = function(e) {
                    function t() {
                        return null !== e && e.apply(this, arguments) || this
                    }
                    return __extends(t, e),
                    t.prototype.typeArg = function() {
                        return o
                    }
                    ,
                    t
                }(e.DebugEventModel);
                t.PendingUploadRowProcessingModel = s;
                var l = function(e) {
                    function t(t) {
                        var n = e.call(this) || this;
                        return n.error = t,
                        n
                    }
                    return __extends(t, e),
                    t.prototype.typeArg = function() {
                        return i
                    }
                    ,
                    t
                }(e.DebugEventModel);
                t.PendingUploadRowErrorModel = l
            }(t.Editor || (t.Editor = {}))
        }(e.Tabs || (e.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            !function(t) {
                var n = PanoptoCore.TypedCallback
                  , o = PanoptoCore.HoverEventType
                  , i = PanoptoCore.OrderChangeType
                  , a = e.Viewer.Controls.EditEventMenu
                  , r = e.Viewer.Controls.OrderedContainer
                  , s = function() {
                    function e() {
                        var t = this;
                        this.orderClass = "outline-order-group",
                        this.hoverClass = "session-reference-hovering",
                        this._seekCallbacks = new n,
                        this._editCallbacks = new n,
                        this._deleteCallbacks = new n,
                        this._eventSeekCallbacks = new n,
                        this._hoverCallbacks = new n,
                        this._orderChangeCallbacks = new n,
                        this.orderedContainer = new r,
                        this.expanded = !1,
                        this.eventRows = {},
                        this.element = $(e.template()),
                        this.sessionReferenceRow = this.element.find(".session-reference-row"),
                        this.sessionReferenceName = this.element.find(".session-reference-name"),
                        this.sessionReferenceDisplayTime = this.element.find(".session-reference-display-time"),
                        this.sessionReferenceToggle = this.element.find(".session-reference-toggle"),
                        this.sessionReferenceExpandedToc = this.element.find(".session-reference-expanded-toc"),
                        this.sessionReferenceOrderUp = this.element.find(".session-reference-order-up"),
                        this.sessionReferenceOrderDown = this.element.find(".session-reference-order-down"),
                        Panopto.Core.UI.Handlers.button(this.element, (function() {
                            t._seekCallbacks.fire(t.sessionReference)
                        }
                        )),
                        this.editMenu = new a(this.sessionReferenceRow,this.sessionReferenceRow.find(".session-reference-edit-toggle"),Panopto.GlobalResources,{
                            toggleAppearsOnHover: !0
                        }),
                        this.editMenu.editCallbacks.add((function(e) {
                            t._editCallbacks.fire(e)
                        }
                        )),
                        this.editMenu.deleteCallbacks.add((function(e) {
                            t._deleteCallbacks.fire(e)
                        }
                        )),
                        Panopto.Core.UI.Handlers.button(this.sessionReferenceToggle, (function() {
                            t.toggleExpandedToc()
                        }
                        )),
                        this.sessionReferenceToggle.attr("title", Panopto.GlobalResources.ViewerPlus_Edit_SessionReference_ExpandTooltip),
                        Panopto.Core.UI.Handlers.hoverableParent(this.sessionReferenceRow.add(this.sessionReferenceExpandedToc), void 0, (function(e) {
                            t.handleHoverHighlight(e),
                            t._hoverCallbacks.fire({
                                sessionReference: t.sessionReference,
                                hoverEventType: e ? o.HoverIn : o.HoverOut
                            })
                        }
                        ), {
                            preserveExisting: !0
                        }),
                        Panopto.Core.UI.Handlers.button(this.sessionReferenceOrderUp, (function() {
                            t.sessionReferenceOrderUp.hasClass("disabled") || t._orderChangeCallbacks.fire({
                                sessionReference: t.sessionReference,
                                orderChangeType: i.OrderUp
                            })
                        }
                        )),
                        Panopto.Core.UI.Handlers.button(this.sessionReferenceOrderDown, (function() {
                            t.sessionReferenceOrderDown.hasClass("disabled") || t._orderChangeCallbacks.fire({
                                sessionReference: t.sessionReference,
                                orderChangeType: i.OrderDown
                            })
                        }
                        )),
                        this.sessionReferenceOrderUp.attr("title", Panopto.GlobalResources.ViewerPlus_Edit_SessionReference_OrderUpTooltip),
                        this.sessionReferenceOrderDown.attr("title", Panopto.GlobalResources.ViewerPlus_Edit_SessionReference_OrderDownTooltip)
                    }
                    return Object.defineProperty(e.prototype, "seekCallbacks", {
                        get: function() {
                            return this._seekCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(e.prototype, "editCallbacks", {
                        get: function() {
                            return this._editCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(e.prototype, "deleteCallbacks", {
                        get: function() {
                            return this._deleteCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(e.prototype, "eventSeekCallbacks", {
                        get: function() {
                            return this._eventSeekCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(e.prototype, "hoverCallbacks", {
                        get: function() {
                            return this._hoverCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(e.prototype, "orderChangeCallbacks", {
                        get: function() {
                            return this._orderChangeCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    e.prototype.render = function(e) {
                        this.sessionReference = e;
                        var t = e.editorStartTime / Panopto.Core.Constants.TimelineChunkMultiplier
                          , n = t + e.referencedSessionDuration
                          , o = Panopto.Core.TimeHelpers.formatDuration(t, Panopto.GlobalResources.TimeSeparator) + " -\n                " + Panopto.Core.TimeHelpers.formatDuration(n, Panopto.GlobalResources.TimeSeparator);
                        this.sessionReferenceName.text(e.name),
                        this.sessionReferenceDisplayTime.text(o),
                        this.editMenu.setEvent(e, {
                            canEdit: !0,
                            canDelete: !0
                        }),
                        this.renderToc()
                    }
                    ,
                    e.prototype.toggleExpandedToc = function() {
                        this.expanded = !this.expanded,
                        this.sessionReferenceToggle.toggleClass("expanded", this.expanded),
                        this.sessionReferenceExpandedToc.toggle(this.expanded),
                        this.sessionReferenceToggle.attr("title", this.expanded ? Panopto.GlobalResources.ViewerPlus_Edit_SessionReference_CollapseTooltip : Panopto.GlobalResources.ViewerPlus_Edit_SessionReference_ExpandTooltip)
                    }
                    ,
                    e.prototype.renderToc = function() {
                        var e = this;
                        this.sessionReferenceExpandedToc.append(this.orderedContainer.element),
                        _.each(this.sessionReference.events.concat(this.sessionReference.slideEvents), (function(t) {
                            t.isDefaultThumbnail || (e.eventRows.hasOwnProperty(t.id) || e.createTocRow(t),
                            e.eventRows[t.id].render({
                                name: t.name,
                                editorTime: t.viewerTime,
                                link: t.link
                            }))
                        }
                        ))
                    }
                    ,
                    e.prototype.createTocRow = function(e) {
                        var n = this
                          , o = new t.EditorEventRow;
                        this.orderedContainer.insert(o.element, e.viewerTime),
                        o.seekCallbacks.add((function(e) {
                            n._eventSeekCallbacks.fire(e)
                        }
                        )),
                        this.eventRows[e.id] = o
                    }
                    ,
                    e.prototype.handleHoverHighlight = function(e) {
                        e ? this.element.addClass(this.hoverClass) : (this.element.removeClass(this.hoverClass),
                        this.sessionReferenceOrderUp.hide(),
                        this.sessionReferenceOrderDown.hide())
                    }
                    ,
                    e.prototype.handleHoverOutline = function(e) {
                        e === o.HoverIn ? this.element.addClass(this.orderClass) : e === o.HoverOut && this.element.removeClass(this.orderClass)
                    }
                    ,
                    e.prototype.displayOrderArrows = function(e, t) {
                        this.sessionReferenceOrderUp.show(),
                        this.sessionReferenceOrderDown.show(),
                        e ? (this.sessionReferenceOrderUp.removeClass("disabled"),
                        this.sessionReferenceOrderUp.attr("tabindex", 0)) : (this.sessionReferenceOrderUp.addClass("disabled"),
                        this.sessionReferenceOrderUp.attr("tabindex", -1)),
                        t ? (this.sessionReferenceOrderDown.removeClass("disabled"),
                        this.sessionReferenceOrderDown.attr("tabindex", 0)) : (this.sessionReferenceOrderDown.addClass("disabled"),
                        this.sessionReferenceOrderDown.attr("tabindex", -1))
                    }
                    ,
                    e.template = _.template('\n            <div class="session-reference-row-wrapper">\n                <div class="session-reference-row" tabindex="0">\n                    <div class="session-reference-toggle material-icons">&#xE5C5;</div>\n                    <div class="session-reference-icon"></div>\n                    <div class="session-reference-name ellipsis"></div>\n                    <div class="session-reference-order-up material-icons" tabindex="0">&#xE5D8</div>\n                    <div class="session-reference-order-down material-icons" tabindex="0">&#xE5DB</div>\n                    <div class="session-reference-edit-toggle material-icons" tabindex="0" title="<@= Panopto.GlobalResources.ViewerPlus_EventMore @>">&#xE5D4;</div>\n                    <div class="session-reference-display-time"></div>\n                </div>\n                <div class="session-reference-expanded-toc" style="display: none;"></div>\n            </div>'),
                    e
                }();
                t.SessionReferenceRow = s
            }(t.Editor || (t.Editor = {}))
        }(t.Tabs || (t.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            !function(t) {
                var n = function() {
                    function n(t) {
                        var n = this;
                        this.slideDeckTemplate = _.template('\n            <div class="slide-deck" style="display:none;">\n                <div class="slide-deck-row">\n                    <div class="slide-deck-expand expanded"></div>\n                    <div class="slide-deck-name ellipsis"></div>\n                    <div class="slide-deck-edit-toggle material-icons" tabindex="0" title="<@= Panopto.GlobalResources.ViewerPlus_EventMore @>">&#xE5D4;</div>\n                </div>\n                <div class="slide-list"></div>\n            </div>\n        '),
                        this.slideEventSelectedCallbacks = $.Callbacks(),
                        this.slideEventAddCallbacks = $.Callbacks(),
                        this.slideEventEditCallbacks = $.Callbacks(),
                        this.slideEventDeleteCallbacks = $.Callbacks(),
                        this.slideDeckDeletedCallbacks = $.Callbacks(),
                        this.slideRows = {},
                        this.element = $(this.slideDeckTemplate()),
                        this.slideDeckExpand = this.element.find(".slide-deck-expand"),
                        this.slideDeckName = this.element.find(".slide-deck-name"),
                        this.slideList = this.element.find(".slide-list"),
                        Panopto.Core.UI.Handlers.button(this.slideDeckExpand, (function() {
                            n.slideDeckExpand.toggleClass(Panopto.Core.Constants.ExpandedClass),
                            n.slideList.toggle(n.slideDeckExpand.hasClass(Panopto.Core.Constants.ExpandedClass))
                        }
                        )),
                        this.editMenu = new e.Viewer.Controls.EditEventMenu(this.element,this.element.find(".slide-deck-edit-toggle"),Panopto.GlobalResources),
                        this.editMenu.deleteCallbacks.add((function(e) {
                            n.slideDeckDeletedCallbacks.fire()
                        }
                        )),
                        t.append(this.element)
                    }
                    return n.prototype.render = function(e) {
                        this.slideDeckId = e.id,
                        this.slideDeckName.html(e.name),
                        this.editMenu.setEvent(e, {
                            canEdit: !1,
                            canDelete: !0
                        }),
                        this.element.show()
                    }
                    ,
                    n.prototype.hide = function() {
                        this.element.hide()
                    }
                    ,
                    n.prototype.remove = function() {
                        this.element.remove()
                    }
                    ,
                    n.prototype.renderSlide = function(e, n) {
                        var o = this;
                        if (!this.slideRows.hasOwnProperty(e.id)) {
                            var i = new t.SlideRow(this.slideList,e);
                            i.slideEventSelectedCallbacks.add((function(t) {
                                o.slideEventSelectedCallbacks.fire(e, t)
                            }
                            )),
                            i.slideEventAddCallbacks.add((function() {
                                o.slideEventAddCallbacks.fire(e)
                            }
                            )),
                            i.slideEventEditCallbacks.add((function(t) {
                                o.slideEventEditCallbacks.fire(e, t)
                            }
                            )),
                            i.slideEventDeleteCallbacks.add((function(t) {
                                o.slideEventDeleteCallbacks.fire(e, t)
                            }
                            )),
                            this.slideRows[e.id] = i
                        }
                        this.slideRows[e.id].renderEvents(n)
                    }
                    ,
                    n.prototype.setCanAddSlide = function(e) {
                        _.each(this.slideRows, (function(t) {
                            t.setCanAddSlide(e)
                        }
                        ))
                    }
                    ,
                    n
                }();
                t.SlideDeckRow = n
            }(t.Editor || (t.Editor = {}))
        }(t.Tabs || (t.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            !function(t) {
                var n = function() {
                    function t(t, n) {
                        var o = this;
                        this.container = t,
                        this.slide = n,
                        this.template = _.template('\n            <div class="slide">\n                <div class="slide-preview-wrapper">\n                    <div class="slide-preview">\n                        <img class="slide-image" src="<@= imageUrl @>" />\n                        <div class="slide-add">\n                            <i class="material-icons">&#xE145;</i>\n                        </div>\n                    </div>\n                </div>\n                <div class="slide-event-list"></div>\n            </div>\n        '),
                        this.eventTemplate = _.template('\n            <div class="index-event" tabindex="0">\n                <div class="index-event-row">\n                    <div class="event-edit-toggle material-icons" tabindex="0" title="<@= Panopto.GlobalResources.ViewerPlus_EventMore @>">&#xE5D4;</div>\n                    <div class="event-time"></div>\n                </div>\n            </div>\n        '),
                        this.slideEventSelectedCallbacks = $.Callbacks(),
                        this.slideEventAddCallbacks = $.Callbacks(),
                        this.slideEventEditCallbacks = $.Callbacks(),
                        this.slideEventDeleteCallbacks = $.Callbacks(),
                        this.eventElements = {},
                        this.eventEditMenus = {},
                        this.element = $(this.template(n)),
                        this.eventList = this.element.find(".slide-event-list"),
                        Panopto.Core.UI.Handlers.button(this.element.find(".slide-add"), (function() {
                            o.canAddSlide && o.slideEventAddCallbacks.fire(n)
                        }
                        )),
                        this.eventListScrollingHighlight = Panopto.Core.UI.Components.scrollingHighlight(this.eventList, !0, e.Viewer.Constants.EventScrollTimeout),
                        t.append(this.element)
                    }
                    return t.prototype.renderEvents = function(t) {
                        var n = this;
                        _.each(t, (function(t) {
                            if (!n.eventElements.hasOwnProperty(t.id)) {
                                var o = $(n.eventTemplate(t));
                                o.find(".event-edit-controls");
                                Panopto.Core.UI.Handlers.button(o, (function() {
                                    n.eventListScrollingHighlight.highlight(t),
                                    n.slideEventSelectedCallbacks.fire(t)
                                }
                                )),
                                n.eventElements[t.id] = o;
                                var i = new e.Viewer.Controls.EditEventMenu(o,o.find(".event-edit-toggle"),Panopto.GlobalResources,{
                                    toggleAppearsOnHover: !0
                                });
                                i.editCallbacks.add((function(e) {
                                    n.slideEventEditCallbacks.fire(e)
                                }
                                )),
                                i.deleteCallbacks.add((function(e) {
                                    n.slideEventDeleteCallbacks.fire(e)
                                }
                                )),
                                n.eventEditMenus[t.id] = i
                            }
                            n.eventElements[t.id].find(".event-time").text(t.displayTime),
                            n.eventList.append(n.eventElements[t.id]),
                            n.eventEditMenus[t.id].setEvent(t, {
                                canEdit: !0,
                                canDelete: !0
                            })
                        }
                        )),
                        _.each(this.eventElements, (function(e, o) {
                            _.some(t, (function(e) {
                                return e.id === o
                            }
                            )) || (e.remove(),
                            delete n.eventElements[o])
                        }
                        ))
                    }
                    ,
                    t.prototype.setCanAddSlide = function(e) {
                        this.canAddSlide = e
                    }
                    ,
                    t
                }();
                t.SlideRow = n
            }(t.Editor || (t.Editor = {}))
        }(t.Tabs || (t.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {})),
function(e) {
    !function(t) {
        !function(t) {
            !function(t) {
                var n = function() {
                    function t() {
                        var n = this;
                        this._streamSeekCallbacks = new PanoptoCore.TypedCallback,
                        this._streamEditCallbacks = new PanoptoCore.TypedCallback,
                        this._streamDeleteCallbacks = new PanoptoCore.TypedCallback,
                        this.element = $(t.template()),
                        this.streamIconCode = this.element.find(".stream-icon-code"),
                        this.streamName = this.element.find(".stream-name"),
                        this.streamDisplayTime = this.element.find(".stream-display-time"),
                        Panopto.Core.UI.Handlers.button(this.element, (function() {
                            n._streamSeekCallbacks.fire(n.stream)
                        }
                        )),
                        this.editEventMenu = new e.Viewer.Controls.EditEventMenu(this.element,this.element.find(".stream-edit-toggle"),Panopto.GlobalResources,{
                            toggleAppearsOnHover: !0
                        }),
                        this.editEventMenu.editCallbacks.add((function(e) {
                            n._streamEditCallbacks.fire(e)
                        }
                        )),
                        this.editEventMenu.deleteCallbacks.add((function(e) {
                            n._streamDeleteCallbacks.fire(e)
                        }
                        ))
                    }
                    return Object.defineProperty(t.prototype, "streamSeekCallbacks", {
                        get: function() {
                            return this._streamSeekCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(t.prototype, "streamEditCallbacks", {
                        get: function() {
                            return this._streamEditCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(t.prototype, "streamDeleteCallbacks", {
                        get: function() {
                            return this._streamDeleteCallbacks
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    t.prototype.render = function(e, t) {
                        this.stream = t;
                        var n = e.calculateEditorTimeFromAbsolute(t.absoluteStart)
                          , o = e.calculateEditorTimeFromAbsolute(t.absoluteEnd)
                          , i = "\n            " + Panopto.Core.TimeHelpers.formatDuration(n, Panopto.GlobalResources.TimeSeparator) + " -\n            " + Panopto.Core.TimeHelpers.formatDuration(o, Panopto.GlobalResources.TimeSeparator);
                        this.streamIconCode.html(t.iconCode),
                        this.streamName.text(t.getStreamName()),
                        this.streamDisplayTime.text(i),
                        this.element.show(),
                        this.editEventMenu.setEvent(t, {
                            canEdit: !0,
                            canDelete: !0
                        })
                    }
                    ,
                    t.prototype.getStream = function() {
                        return this.stream
                    }
                    ,
                    t.template = _.template('\n            <div class="stream-row" tabindex="0">\n                <div class="stream-icon-code material-icons"></div>\n                <div class="stream-name ellipsis"></div>\n                <div class="stream-edit-toggle material-icons" tabindex="0" title="<@= Panopto.GlobalResources.ViewerPlus_EventMore @>">&#xE5D4;</div>\n                <div class="stream-display-time"></div>\n            </div>'),
                    t
                }();
                t.StreamRow = n
            }(t.Editor || (t.Editor = {}))
        }(t.Tabs || (t.Tabs = {}))
    }(e.Viewer || (e.Viewer = {}))
}(PanoptoTS || (PanoptoTS = {}));
//# sourceMappingURL=file://///seasyn/jenkinsbuilds/rel_rtc_11.7.0/11.7.0.00011/_PublishedWebsites/WebUI/Scripts/Panopto/Bundles/Viewer.js.map
